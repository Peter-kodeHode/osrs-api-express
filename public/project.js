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
      showLoading(false);

      if (response.status === 404) {
        throw new Error("PLAYER_NOT_FOUND");
      }
      if (response.status === 400) {
        throw new Error("INVALID_PLAYER_NAME");
      }
      if (!response.ok) {
        throw new Error(`HTTP_ERROR_${response.status}`);
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
        throw new Error("INVALID_DATA");
      }

      const skillsWithNames = data.skills.map((skill, index) => ({
        ...skill,
        skillName: SKILL_NAMES[index] || `Unknown Skills${index}`,
      }));

      const highscoreContainer = document.getElementById("highscoreContainer");
      highscoreContainer.innerHTML = "";

      const skillsContainer = document.createElement("div");
      skillsContainer.innerHTML = `<h3>Stats for ${data.name}</h3>`;
      skillsWithNames.forEach((skill, index) => {
        const skillParagraph = document.createElement("p");
        skillParagraph.className = "hiscoreText";
        skillParagraph.innerHTML = `${skill.skillName}: Level ${skill.level} (Rank: ${skill.rank}), XP: ${skill.xp}`;
        skillsContainer.appendChild(skillParagraph);
      });

      highscoreContainer.appendChild(skillsContainer);

      showResults(true);
    })
    .catch((error) => {
      console.error("Error fetching hiscore:", error);
      showLoading(false);

      let errorMessage;
      switch (error.message) {
        case "PLAYER_NOT_FOUND":
          errorMessage = `Player "${playerName}" not found. Please check the spelling and try again.`;
          break;
        case "INVALID_PLAYER_NAME":
          errorMessage =
            "Invalid player name format. Please use only letters, numbers, spaces, underscores, and hyphens.";
          break;
        case "INVALID_DATA":
          errorMessage =
            "Received invalid data from the server. Please try again.";
          break;
        default:
          if (error.message.startsWith("HTTP_ERROR_")) {
            const statusCode = error.message.replace("HTTP_ERROR_", "");
            errorMessage = `Server error (${statusCode}). Please try again later.`;
          } else if (
            error.name === "TypeError" &&
            error.message.includes("fetch")
          ) {
            errorMessage =
              "Network error. Please check your connection and try again.";
          } else {
            errorMessage = "An unexpected error occurred. Please try again.";
          }
          break;
      }

      showError(errorMessage);
    });
}

function showLoading(show) {
  const loadingMessage = document.getElementById("loadingMessage");
  loadingMessage.style.display = show ? "block" : "none";
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

function showError(message) {
  let errorElement = document.getElementById("errorMessage");
  if (!errorElement) {
    errorElement = document.createElement("p");
    errorElement.id = "errorMessage";
    const searchForm = document.getElementById("searchForm");
    searchForm.appendChild(errorElement);
  }
  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function handleSearch() {
  const playerNameInput = document.getElementById("playerNameInput");
  const playerName = playerNameInput.value.trim();

  const existingError = document.getElementById("errorMessage");
  if (existingError) {
    existingError.style.display = "none";
  }

  if (!playerName) {
    showError("Please enter a player name");
    return;
  }

  if (playerName.length > 12) {
    showError("Player names cannot be longer than 12 characters");
    return;
  }

  if (!/^[a-zA-Z0-9\s_-]+$/.test(playerName)) {
    showError(
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
  const searchAgainButton = document.getElementById("searchAgainButton"); // Add this line

  searchButton.addEventListener("click", handleSearch);
  searchAgainButton.addEventListener("click", resetSearch); // Add this line

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
