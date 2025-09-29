const express = require(`express`);
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/hiscores", async (req, res) => {
  try {
    const playerName = req.query.player || `WaifuTed`;
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
    const hiscoreData = await response.json();
    res.json(hiscoreData);
  } catch (error) {
    console.error("Error fetching hiscore data", error);
    res.status(500).send("Could not get hiscore data");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
