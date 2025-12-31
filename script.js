document.addEventListener("DOMContentLoaded", () => {

    // --------------------
    // STATE
    // --------------------
    const GAME_DURATION_SECONDS = 60 * 60;
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
    const hintBtn = document.getElementById("hint-btn");
    const killBtn = document.getElementById("kill-btn");
    const characterItems = document.querySelectorAll("#character-list li");
    const gameContainer = document.getElementById("game-container");
    const buttonBar = document.getElementById("button-bar");
    const charList = document.getElementById("character-list");
    const body = document.body;

    // --------------------
    // INTRO VIDEO LOGIC
    // --------------------
    const introOverlay = document.getElementById("intro-overlay");
    const introPlayBtn = document.getElementById("intro-play-btn");
    const introVideoContainer = document.getElementById("intro-video-container");
    const introVideo = document.getElementById("intro-video");

    gameContainer.style.display = "none";
    buttonBar.style.display = "none";
    characterList.style.display = "none";

    introPlayBtn.addEventListener("click", () => {
        introOverlay.style.display = "none";
        introVideoContainer.style.display = "block";
        introVideo.play();
    });

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
        gameContainer.style.display = "none";
        buttonBar.style.display = "none";
        charList.style.display = "none";
        body.style.background = "#000";
    }

    function resumeAfterBlackout() {
        isBlackout = false;
        gameContainer.style.display = "flex";
        buttonBar.style.display = "flex";
        charList.style.display = "block";
        body.style.background = "";
    }

    // --------------------
    // FULLSCREEN TOGGLE
    // --------------------
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // --------------------
    // EVENT LISTENERS
    // --------------------
    document.addEventListener("keydown", (e) => {
        if (e.key === "f" || e.key === "F") {
            toggleFullscreen();
        }
        
        if (e.code === "Space" && !introVideo.ended && introVideoContainer.style.display === "block") {
            e.preventDefault();

            if (introVideo.paused) {
                introVideo.play();
            } else {
                introVideo.pause();
            }
        }

        if (e.code === "Space" && isBlackout) {
            resumeAfterBlackout();
        }
    });

    characterItems.forEach(item => {
        item.addEventListener("click", () => {
            if (!item.classList.contains("dead")) {
                item.classList.toggle("dead");
                addKill();
            } else {
                item.classList.toggle("dead");
            }
        });
    });

    // startText.addEventListener("click", () => {
    //     startText.style.display = "none";
    //     timerLabel.style.display = "block";
    //     gameContainer.style.display = "flex";
    //     updateTimerDisplay();
    //     startTimer();
    // });

    introVideo.addEventListener("ended", () => {
        introVideoContainer.style.display = "none";

        gameContainer.style.display = "flex";
        buttonBar.style.display = "flex";
        characterList.style.display = "block";

        updateTimerDisplay();
        startTimer();
    });


    if (blackoutBtn) blackoutBtn.addEventListener("click", triggerBlackout);
    if (hintBtn) hintBtn.addEventListener("click", useClue);
    if (killBtn) killBtn.addEventListener("click", addKill);

    // --------------------
    // INITIAL RENDER
    // --------------------
    updateTimerDisplay();
    updateKillCountDisplay();
    
});