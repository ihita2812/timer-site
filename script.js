document.addEventListener("DOMContentLoaded", () => {

    // --------------------
    // STATE
    // --------------------
    const GAME_DURATION_SECONDS = 60 * 60; // 60 minutes
    const CLUE_PENALTY_SECONDS = 5 * 60;

    let totalSeconds = GAME_DURATION_SECONDS;
    let killCount = 1;
    let isRunning = false;
    let isBlackout = false;
    let timerInterval = null;

    // --------------------
    // AUDIO
    // --------------------
    const killSound = new Audio("sounds/kill-sound.mp3");
    killSound.volume = 0.9;

    // --------------------
    // DOM ELEMENTS
    // --------------------
    const startText = document.getElementById("start-text");
    const timerLabel = document.getElementById("timer-label");
    const timerDisplay = document.getElementById("timer");
    const killNumber = document.getElementById("killNumber");
    const blackoutBtn = document.getElementById("blackout-btn");
    const characterItems = document.querySelectorAll("#character-list li");
    const gameContainer = document.getElementById("game-container");
    const buttonBar = document.getElementById("button-bar");
    const charList = document.getElementById("character-list");
    const body = document.body;

    // --------------------
    // HELPER FUNCTIONS
    // --------------------
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(totalSeconds);
    }

    function updateKillCountDisplay() {
        killNumber.textContent = killCount;
    }

    function playMurderSound() {
        murderSound.currentTime = 0;
        murderSound.play();
    }

    // --------------------
    // TIMER CONTROL
    // --------------------
    function tick() {
        if (!isBlackout && totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
        }
    }

    function startTimer() {
        if (!timerInterval) {
            timerInterval = setInterval(tick, 1000);
            isRunning = true;
        }
    }

    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
        isRunning = false;
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
        playMurderSound();
    }

    // --------------------
    // BLACKOUT CONTROL
    // --------------------
    function triggerBlackout() {
        isBlackout = true;
        gameContainer.style.display = "none";  // hide all UI
        buttonBar.style.display = "none";      // hide button bar
        charList.style.display = "none";       // hide character list
        body.style.background = "#000";        // black screen
    }

    function resumeAfterBlackout() {
        isBlackout = false;
        gameContainer.style.display = "flex";  // restore UI
        buttonBar.style.display = "flex";      // restore button bar
        charList.style.display = "block";      // restore character list
        body.style.background = "";             // restore background
    }

    // --------------------
    // EVENT LISTENERS
    // --------------------
    startText.addEventListener("click", () => {
        startText.style.display = "none";
        timerLabel.style.display = "block";  // show "Time left remaining:"
        gameContainer.style.display = "flex"; // ensure visible
        updateTimerDisplay();
        startTimer();
    });

    if (blackoutBtn) blackoutBtn.addEventListener("click", triggerBlackout);

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && isBlackout) {
            resumeAfterBlackout();
        }
    });

    characterItems.forEach(item => {
        item.addEventListener("click", () => {
            if (!item.classList.contains("dead")) {
                item.classList.toggle("dead"); // triggers strike-through
            }
        });
    });

    // --------------------
    // INITIAL RENDER
    // --------------------
    updateTimerDisplay();
    updateKillCountDisplay();
});