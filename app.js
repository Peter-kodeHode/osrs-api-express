const express = require(`express`);
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/hiscores", async (req, res) => {
  try {
    const playerName = req.query.player;
    if (!playerName || playerName.trim() === "") {
      return res.status(400).json({ error: "Player name is required" });
    }

    if (playerName.length > 12) {
      return res
        .status(400)
        .json({ error: "Player name cannot be longer than 12 characters" });
    }

    if (!/^[a-zA-Z0-9\s_-]+$/.test(playerName)) {
      return res.status(400).json({ error: "Invalid player name format" });
    }

    const osrsUrl = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player=${playerName}`;

    const response = await fetch(osrsUrl);

    if (response.status === 404) {
      return res.status(404).json({ error: "Player not found" });
    }

    if (!response.ok) {
      throw new Error(`OSRS API returned status: ${response.status}`);
    }

    const hiscoreData = await response.json();
    res.json(hiscoreData);
  } catch (error) {
    console.error("Error fetching hiscore data", error);
    res.status(500).json({ error: "Could not get hiscore data" });
  }
});

app.get("/templeosrs", async (req, res) => {
  try {
    const playerName = req.query.player;
    if (!playerName || playerName.trim() === "") {
      return res.status(400).json({ error: "Player name is required" });
    }

    // const templeUrl = `https://templeosrs.com/api/player_info.php?player=${encodeURIComponent(
    //   playerName
    // )}`;

    // const templeUrl = `https://templeosrs.com/api/collection-log/player_collection_log.php?player=${encodeURIComponent(
    //   playerName
    // )}&categories=all&includenames=1`;

    const templeUrl = `https://templeosrs.com/api/player_gains.php?player=${encodeURIComponent(
      playerName
    )}&time=month`;

    const response = await fetch(templeUrl);
    if (response.status === 404) {
      return res.status(404).json({ error: "Player not found" });
    }
    if (!response.ok) {
      throw new Error(`Temple OSRS API returned status: ${response.status}`);
    }
    const templeData = await response.json();
    res.json(templeData);
  } catch (error) {
    console.error("Error fetching Temple OSRS data", error);
    res.status(500).json({ error: "Could not get Temple OSRS data" });
  }
});

app.get("/catfacts", async (req, res) => {
  try {
    const catUrl = `https://catfact.ninja/fact`;

    const response = await fetch(catUrl);
    const catData = await response.json();
    res.json(catData);
  } catch (error) {
    console.error("Error fetching cat fact:", error);
    res.status(500).json({ error: "Failed to fetch cat fact" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
