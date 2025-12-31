document.addEventListener("DOMContentLoaded", () => {

    // --------------------
    // STATE
    // --------------------
    const GAME_DURATION_SECONDS = 60 * 60;
    const CLUE_PENALTY_SECONDS = 5 * 60;

    let totalSeconds = GAME_DURATION_SECONDS;
    let killCount = 0;
    let isRunning = false;
    let isBlackout = false;
    let timerInterval = null;

    // --------------------
    // AUDIO
    // --------------------
    const killSound = new Audio("media/sounds/kill-sound.mov");
    killSound.volume = 0.9;

    const bgSound = new Audio("media/sounds/bg.mp3");
    bgSound.loop = true;
    bgSound.volume = 0.4;

    const endBuzzer = new Audio("media/sounds/end-buzzer.mov");
    endBuzzer.volume = 1.0;
    endBuzzer.playbackRate = 0.9;

    // --------------------
    // DOM ELEMENTS
    // --------------------
    const timerDisplay = document.getElementById("timer");
    const killNumber = document.getElementById("killNumber");

    const blackoutBtn = document.getElementById("blackout-btn");
    const hintBtn = document.getElementById("hint-btn");
    const killBtn = document.getElementById("kill-btn");

    const characterItems = document.querySelectorAll("#character-list li");
    const charList = document.getElementById("character-list");

    const gameContainer = document.getElementById("game-container");
    const buttonBar = document.getElementById("button-bar");
    const body = document.body;

    const introOverlay = document.getElementById("intro-overlay");
    const introPlayBtn = document.getElementById("intro-play-btn");
    const introVideoContainer = document.getElementById("intro-video-container");
    const introVideo = document.getElementById("intro-video");

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

    function playKillSound() {
        killSound.currentTime = 0;
        killSound.play();
    }

    function fadeInBgSound() {
        bgSound.volume = 0;
        bgSound.play();

        const fade = setInterval(() => {
            if (bgSound.volume < 0.4) {
                bgSound.volume += 0.02;
            } else {
                clearInterval(fade);
            }
        }, 100);
    }

    function playBuzzerNTimes(times) {
        let count = 0;

        endBuzzer.currentTime = 0;
        endBuzzer.play();

        endBuzzer.onended = () => {
            count++;

            if (count < times) {
                endBuzzer.currentTime = 0;
                endBuzzer.play();
            } else {
                endBuzzer.onended = null; // cleanup
            }
        };
    }

    // --------------------
    // TIMER CONTROL
    // --------------------
    function tick() {
        if (!isBlackout && totalSeconds > 0) {
            totalSeconds--;
            updateTimerDisplay();
        }

        if (totalSeconds === 0) {
            stopTimer();

            bgSound.pause();
            bgSound.currentTime = 0;

            playBuzzerNTimes(3);
        }
    }

    function startTimer() {
        if (!timerInterval) {
            timerInterval = setInterval(tick, 1000);
            isRunning = true;

            if (bgSound.paused) {
                fadeInBgSound();
            }
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
        playKillSound();
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
                console.error("Fullscreen error:", err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // --------------------
    // EVENT LISTENERS
    // --------------------
    document.addEventListener("keydown", (e) => {

        // Fullscreen
        if (e.key === "f" || e.key === "F") {
            toggleFullscreen();
            return;
        }

        // Resume from blackout
        if (e.code === "Space" && isBlackout) {
            e.preventDefault();
            resumeAfterBlackout();
            return;
        }

        // Pause / play intro video
        if (
            e.code === "Space" &&
            introVideoContainer.style.display === "block" &&
            !introVideo.ended
        ) {
            e.preventDefault();
            introVideo.paused ? introVideo.play() : introVideo.pause();
        }
    });

    introPlayBtn.addEventListener("click", () => {
        // hide overlay
        introOverlay.style.display = "none";

        // show video container
        introVideoContainer.style.display = "flex";

        // reset video
        introVideo.currentTime = 0;
        introVideo.muted = true;
        introVideo.style.display = "block";

        // THIS is key: play() must be called **directly in this click handler**
        introVideo.play().catch(err => console.error("Video play failed:", err));
    });

    introVideo.addEventListener("ended", () => {
        introVideoContainer.style.display = "none";

        gameContainer.style.display = "flex";
        buttonBar.style.display = "flex";
        charList.style.display = "block";

        updateTimerDisplay();
        startTimer();
    });

    characterItems.forEach(item => {
        item.addEventListener("click", () => {
            if (!item.classList.contains("dead")) {
                item.classList.add("dead");
                addKill();
            }
        });
    });

    if (blackoutBtn) blackoutBtn.addEventListener("click", triggerBlackout);
    if (hintBtn) hintBtn.addEventListener("click", useClue);
    if (killBtn) killBtn.addEventListener("click", addKill);

    // --------------------
    // INITIAL RENDER
    // --------------------
    gameContainer.style.display = "none";
    buttonBar.style.display = "none";
    charList.style.display = "none";

    updateTimerDisplay();
    updateKillCountDisplay();

});
