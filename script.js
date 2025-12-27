// --------------------
// STATE
// --------------------
const GAME_DURATION_SECONDS = 60 * 60; // 60 minutes
const CLUE_PENALTY_SECONDS = 5 * 60;

let totalSeconds = GAME_DURATION_SECONDS;
let killCount = 1;
let isRunning = false;
let timerInterval = null;

// --------------------
// DOM ELEMENTS
// --------------------
const timerDisplay = document.getElementById("timer");
const killCountDisplay = document.getElementById("killCount");

const toggleBtn = document.getElementById("toggleBtn");
const clueBtn = document.getElementById("clueBtn");
const killBtn = document.getElementById("killBtn");

// --------------------
// UI UPDATE FUNCTIONS
// --------------------
function updateTimerDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateKillCountDisplay() {
  killCountDisplay.textContent = `🔪 Kill Count: ${killCount}`;
}

// --------------------
// TIMER CONTROL
// --------------------
function startTimer() {
  timerInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateTimerDisplay();
    } else {
      stopTimer();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  toggleBtn.textContent = "Play";
}

function toggleTimer() {
  if (isRunning) {
    stopTimer();
  } else {
    startTimer();
    toggleBtn.textContent = "Pause";
    isRunning = true;
  }
}

// --------------------
// GAME ACTIONS
// --------------------
function useClue() {
  totalSeconds = Math.max(0, totalSeconds - CLUE_PENALTY_SECONDS);
  updateTimerDisplay();
}

function addKill() {
  killCount++;
  updateKillCountDisplay();
}

// --------------------
// EVENT LISTENERS
// --------------------
toggleBtn.addEventListener("click", toggleTimer);
clueBtn.addEventListener("click", useClue);
killBtn.addEventListener("click", addKill);

// --------------------
// INITIAL RENDER
// --------------------
updateTimerDisplay();
updateKillCountDisplay();
