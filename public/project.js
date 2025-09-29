const API_URL =
  window.location.hostname === "localhost" ? "http://localhost:3000" : "";

const SKILL_NAMES = [
  "Overall",
  "Attack",
  "Defence",
  "Strength",
  "Hitpoints",
  "Ranged",
  "Prayer",
  "Magic",
  "Cooking",
  "Woodcutting",
  "Fletching",
  "Fishing",
  "Firemaking",
  "Crafting",
  "Smithing",
  "Mining",
  "Herblore",
  "Agility",
  "Thieving",
  "Slayer",
  "Farming",
  "Runecraft",
  "Hunter",
  "Construction",
];

function fetchHiscore(playerName) {
  showLoading(true);
  fetch(`${API_URL}/hiscores?player=${encodeURIComponent(playerName)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (
        !data ||
        !data.skills ||
        !Array.isArray(data.skills) ||
        data.skills.length === 0
      ) {
        throw new Error("Invalid or missing skills data from API");
      }
      if (data.skills && data.skills.length > 0) {
        const skillsWithNames = data.skills.map((skill, index) => ({
          ...skill,
          skillName: SKILL_NAMES[index] || `Unknown Skills${index}`,
        }));

        const highscoreContainer =
          document.getElementById("highscoreContainer");
        const highscoreElement = document.querySelector(".highscoreText");

        highscoreContainer.innerHTML = highscoreContainer.innerHTML = "";

        const skillsContainer = document.createElement("div");
        skillsContainer.innerHTML = `<h3>Stats for ${data.name}</h3>`;
        skillsWithNames.forEach((skill, index) => {
          const skillDiv = document.createElement(`div`);
          skillDiv.innerHTML = `${skill.skillName}: Level ${skill.level} (Rank: ${skill.rank}), XP: ${skill.xp}`;
          skillsContainer.appendChild(skillDiv);
        });
        const searchAgainButton = document.createElement("button");
        searchAgainButton.id = "searchAgainButton";
        searchAgainButton.textContent = "Search Another Player";
        searchAgainButton.addEventListener("click", resetSearch);
        highscoreContainer.appendChild(searchAgainButton);
        showResults(true);
        showLoading(false);
        document
          .getElementById("highscoreContainer")
          .appendChild(skillsContainer);
      }
    });
}

function showLoading(show) {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = show ? "block" : "none";

  const existingError = document.getElementById("errorMessage");
  if (existingError) {
    existingError.remove();
  }
}

function showResults(show) {
  const inputContainer = document.getElementById("inputContainer");
  const highscoreContainer = document.getElementById("highscoreContainer");
  const catfactContainer = document.getElementById("catfactContainer");
  if (show) {
    inputContainer.style.display = "none";
    highscoreContainer.style.display = "block";
    catfactContainer.style.display = "block";
  } else {
    inputContainer.style.display = "block";
    highscoreContainer.style.display = "none";
    catfactContainer.style.display = "none";
  }
}

function handleSearch() {
  const playerNameInput = document.getElementById("playerNameInput");
  const playerName = playerNameInput.value.trim();

  if (!playerName) {
    alert("Please enter a player name");
    return;
  }

  if (playerName.length > 12) {
    alert("Player names cannot be longer than 12 characters");
    return;
  }

  if (!/^[a-zA-Z0-9\s_-]+$/.test(playerName)) {
    alert(
      "Player names can only contain letters, numbers, spaces, underscores, and hyphens"
    );
    return;
  }

  fetchHiscore(playerName);
  fetchCatFact();
}

function fetchCatFact() {
  showLoading(true);
  fetch(`${API_URL}/catfacts`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      showLoading(false);

      const catFactText = document.querySelector(".catFactText");
      if (catFactText && data) {
        catFactText.innerHTML = `<h3>Cat Fact:</h3> ${
          data.fact || data.text || data
        }`;
      }
    })
    .catch((error) => {
      console.error("Error fetching cat fact:", error);
      showLoading(false);

      const catfactContainer = document.getElementById("catfactContainer");
      if (catfactContainer) {
        catfactContainer.innerHTML = `<p>Failed to load cat fact: ${error.message}</p>`;
      }
    });
}

function resetSearch() {
  const playerNameInput = document.getElementById("playerNameInput");
  playerNameInput.value = "";
  showResults(false);

  const existingError = document.getElementById("errorMessage");
  if (existingError) {
    existingError.remove();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  const playerNameInput = document.getElementById("playerNameInput");

  searchButton.addEventListener("click", handleSearch);

  playerNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });

  playerNameInput.focus();
});

const button = document.getElementById("moreCatFact");
button.addEventListener("click", async () => {
  fetchCatFact();
});
