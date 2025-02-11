// Game Variables
let playerName = "";
let score = 0;
let heartsHit = 0;
let coinFallCount = 0;
let gameInterval;
let isPaused = false;
let gameEnded = false;

// DOM Elements
const homepage = document.getElementById("homepage");
const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const playerNameInput = document.getElementById("player-name");
const playerNameDisplay = document.getElementById("player-name-display");
const gameOverMessage = document.getElementById("game-over-message");
const finalScore = document.getElementById("final-score");
const scoreDisplay = document.getElementById("score");
const coinsMissedDisplay = document.getElementById("coins-missed");
const heartsHitDisplay = document.getElementById("hearts-hit");
const gun = document.getElementById("gun");
const bulletsContainer = document.getElementById("bullets-container");
const fallingObjectsContainer = document.getElementById("falling-objects-container");

// Event Listeners
document.getElementById("play-now").addEventListener("click", showLoginScreen);
document.getElementById("start-game").addEventListener("click", startGame);
document.getElementById("pause-game").addEventListener("click", togglePause);
document.getElementById("stop-game").addEventListener("click", stopGame);
document.getElementById("restart-game").addEventListener("click", restartGame);
document.addEventListener("mousemove", moveGun);
document.addEventListener("click", shootBullet);

// Show Login Screen
function showLoginScreen() {
  homepage.classList.add("hidden");
  loginScreen.classList.remove("hidden");
}

// Start Game
function startGame() {
  playerName = playerNameInput.value.trim();
  if (!playerName) {
    alert("Please enter your name!");
    return;
  }
  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  playerNameDisplay.textContent = playerName;
  startGameLoop();
}

// Move Gun with Mouse
function moveGun(e) {
  const x = e.clientX;
  gun.style.left = `${x}px`;
}

// Shoot Bullet
function shootBullet() {
  if (isPaused || gameEnded) return;
  const bullet = document.createElement("div");
  bullet.classList.add("bullet");
  const barrelRect = document.getElementById("gun-barrel").getBoundingClientRect();
  bullet.style.left = `${barrelRect.left + barrelRect.width / 2 - 2.5}px`;
  bullet.style.bottom = `${window.innerHeight - barrelRect.top}px`;
  bulletsContainer.appendChild(bullet);

  // Move bullet upwards
  const bulletInterval = setInterval(() => {
    const bulletBottom = parseInt(bullet.style.bottom);
    if (bulletBottom > window.innerHeight) {
      clearInterval(bulletInterval);
      bullet.remove();
    } else {
      bullet.style.bottom = `${bulletBottom + 10}px`;
      detectCollision(bullet);
    }
  }, 20);
}

// Detect Collision
function detectCollision(bullet) {
  const fallingObjects = document.querySelectorAll(".falling-object");
  fallingObjects.forEach((object) => {
    const bulletRect = bullet.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();
    if (
      bulletRect.left < objectRect.right &&
      bulletRect.right > objectRect.left &&
      bulletRect.top < objectRect.bottom &&
      bulletRect.bottom > objectRect.top
    ) {
      handleCollision(object);
      bullet.remove();
    }
  });
}

// Handle Collision
function handleCollision(object) {
  if (object.classList.contains("coin")) {
    const value = parseInt(object.getAttribute("data-value"));
    score += value;
    scoreDisplay.textContent = score;
  } else if (object.classList.contains("heart")) {
    score = Math.max(0, Math.floor(score * 0.8)); // Reduce score by 20%
    heartsHit++;
    heartsHitDisplay.textContent = heartsHit;
    if (heartsHit >= 5 && !gameEnded) {
      endGame("hearts");
    }
  }
  object.remove();
}

// Show Message
function showMessage(message) {
  const msg = document.getElementById("message-system");
  msg.textContent = message;
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 2000);
}

// Start Game Loop
function startGameLoop() {
  gameInterval = setInterval(() => {
    if (!isPaused && !gameEnded) createFallingObject();
  }, 1000);
}

// Create Falling Objects
function createFallingObject() {
  const object = document.createElement("div");
  object.classList.add("falling-object");
  const type = Math.random() > 0.5 ? "coin" : "heart";
  object.classList.add(type);
  
  if (type === "coin") {
    // Set coin values to Rs2, Rs5, Rs10, Rs50
    const values = [2, 5, 10, 50];
    const value = values[Math.floor(Math.random() * values.length)];
    object.setAttribute("data-value", value);
    object.textContent = value; // Display value inside the coin
  }
  
  // Start at top of screen
  object.style.top = "0px";
  object.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
  fallingObjectsContainer.appendChild(object);

  const objectInterval = setInterval(() => {
    if (isPaused || gameEnded) return;
    const objectTop = parseInt(object.style.top) || 0;
    
    if (object.classList.contains("coin")) {
      // Coin is considered fallen when its top reaches the ground (window.innerHeight - 30)
      if (objectTop >= (window.innerHeight - 30)) {
        clearInterval(objectInterval);
        object.remove();
        coinFallCount++;
        coinsMissedDisplay.textContent = coinFallCount;
        if (coinFallCount >= 100 && !gameEnded) {
          endGame("coins");
        }
      } else {
        object.style.top = `${objectTop + 5}px`;
      }
    } else {
      // For hearts, only consider those visible on the screen
      if (objectTop > window.innerHeight) {
        clearInterval(objectInterval);
        object.remove();
      } else {
        object.style.top = `${objectTop + 5}px`;
      }
    }
  }, 50);
}

// End Game with cause: either "coins" or "hearts"
function endGame(cause) {
  gameEnded = true;
  clearInterval(gameInterval);
  gameScreen.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  let causeMessage = "";
  if (cause === "coins") {
    causeMessage = "You Missed 100 coins.";
  } else if (cause === "hearts") {
    causeMessage = "Match Over: You hit 5 hearts.";
  }
  gameOverMessage.textContent = causeMessage;
  finalScore.textContent = score;
}

// Pause Game
function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pause-game").textContent = isPaused ? "Resume" : "Pause";
}

// Stop Game
function stopGame() {
  clearInterval(gameInterval);
  location.reload();
}

// Restart Game
function restartGame() {
  location.reload();
                        }
