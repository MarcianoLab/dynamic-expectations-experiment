

function createArray(length) {
    return Array.from({ length }, (_, i) => i);
}

function createGeneralElement(element, classes, id) {
    const newElement = document.createElement(element);
    newElement.classList.add(...classes);
    newElement.id = id;
    return newElement;
}

function createContainer(id, containerType) {
    className = containerType + "-container";
    const wideContainer = createGeneralElement(
        "div",
        [className],
        className + id
    );
    return wideContainer;
}

function createButton(id, classes, text) {
    const button = createGeneralElement("button", classes, "btn" + id);
    button.innerText = text;
    return button;
}

function createProgressBar(id) {
    const classes = ["progress-wrapper", "progress", "progress-text"];
    const elements = classes.map((className) => {
        return createGeneralElement("div", [className], className + id);
    });
    const [progressWrapper, progress, progressText] = elements;
    progressText.innerText = "0%";
    progressWrapper.appendChild(progress);
    progressWrapper.appendChild(progressText);
    return { progressWrapper, progress, progressText };
}

function createDiceElement(id) {
    const dice = createGeneralElement("div", ["dice"], "dice" + id);
    const faces = ["front", "back", "left", "right", "top", "bottom"];
    faces.forEach((face, _) => {
        const faceDiv = createGeneralElement("div", ["face", face], face + id);
        dice.appendChild(faceDiv);
    });
    return dice;
}

function setContainerDisable(diceId) {
    const idName = "#long-container";
    const currentLongDiceContainer = document.querySelector(idName + diceId);
    const nextLongDiceContainer = document.querySelector(
        idName + `${Number(diceId) + 1}`
    );
    currentLongDiceContainer.classList.add("disable");
    if (!nextLongDiceContainer) return;
    nextLongDiceContainer.classList.remove("disable");
}

function addLoading(duration, rollBtn, diceId) {
    rollBtn.style.visibility = "hidden";

    const loader = createGeneralElement("div", ["loader"], "loader");
    const longContainerBtn = document.querySelector("#long-containerbtn");

    setTimeout(() => {
        longContainerBtn.prepend(loader);
        setTimeout(() => {
            longContainerBtn.removeChild(loader);
            rollBtn.style.visibility = "visible";
            setContainerDisable(diceId);
        }, duration);
    }, 500);
}

function rollDice(random, dice) {
    const xRotation = 720 + Math.random() * 360;
    const yRotation = 720 + Math.random() * 360;

    dice.style.animation = "none";
    dice.style.transition = "transform 2s ease-out";

    setTimeout(() => {
        dice.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }, 50);

    const diceAnimationTime =
        Math.floor(Math.random() * (2000 - 1500 + 1)) + 1500;

    setTimeout(() => {
        setFinalPosition(random, dice);
    }, diceAnimationTime);
}

function setFinalPosition(random, dice) {
    dice.style.transition = "transform 0.5s ease-out";

    switch (random) {
        case 1:
            dice.style.transform = "rotateX(0deg) rotateY(0deg)";
            break;
        case 6:
            dice.style.transform = "rotateX(180deg) rotateY(0deg)";
            break;
        case 2:
            dice.style.transform = "rotateX(-90deg) rotateY(0deg)";
            break;
        case 5:
            dice.style.transform = "rotateX(90deg) rotateY(0deg)";
            break;
        case 3:
            dice.style.transform = "rotateX(0deg) rotateY(90deg)";
            break;
        case 4:
            dice.style.transform = "rotateX(0deg) rotateY(-90deg)";
            break;
    }
}

function interpolateColor(color1, color2, factor) {
    const hexToRgb = (hex) => {
        const bigint = parseInt(hex.slice(1), 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    };

    const rgbToHex = (rgb) => {
        return (
            "#" +
            rgb
                .map((val) => {
                    const hex = val.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                })
                .join("")
        );
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const result = rgb1.map((c1, i) =>
        Math.round(c1 + factor * (rgb2[i] - c1))
    );

    return rgbToHex(result);
}

function calculateProbability(currentSum, remainingDice, targetSum = 21) {
    if (currentSum >= targetSum) return 1;
    if (remainingDice === 0) return currentSum >= targetSum ? 1 : 0;

    let favorableOutcomes = 0;
    const totalOutcomes = Math.pow(6, remainingDice);

    function countFavorableOutcomes(sum, diceLeft) {
        if (diceLeft === 0) {
            if (sum >= targetSum) favorableOutcomes++;
            return;
        }
        for (let i = 1; i <= 6; i++) {
            countFavorableOutcomes(sum + i, diceLeft - 1);
        }
    }

    countFavorableOutcomes(currentSum, remainingDice);
    return favorableOutcomes / totalOutcomes;
}

function createPreStartElement() {
    const longContainer = createContainer("pre-start", "long");
    const container = createContainer("pre-start", "normal");

    const circle = createGeneralElement(
        "div",
        ["dice", "circle"],
        "pre-start-circle"
    );
    circle.innerText = "Pre-start";

    const { progressWrapper, progress, progressText } =
        createProgressBar("pre-start");
    const chanceText = createGeneralElement(
        "div",
        ["chance-text"],
        "chance-text"
    );
    chanceText.innerText = "Current winning chance";
    progressWrapper.classList.add("pre-start");
    progressWrapper.append(chanceText);
    longContainer.append(progressWrapper);
    container.append(circle);
    longContainer.append(container);

    longContainer.style.marginRight = "50px";

    const initialProbability = calculateProbability(0, NUM_OF_DICE) * 100;
    progress.style.height = initialProbability + 15 + "%";
    progressText.textContent = Math.round(initialProbability) + "%";

    return longContainer;
}

function getRollResult(diceId) {
    const roll = CURRENT_GAME.diceResults[diceId];
    CURRENT_SUM += roll;
    return roll;
}

function randomDice(dice, diceId, rollBtn, gameId) {
    if (!dice) return;
    // const diceId = dice.id.slice(-1);
    const random = getRollResult(diceId);
    console.log("diceId", diceId);
    const longDiceContainer = document.querySelector(
        "#long-container" + diceId
    );
    console.log("longDiceContainer", longDiceContainer);
    rollBtn.disabled = true;
    rollDice(random, dice);
    setTimeout(() => {
        const { progressWrapper, progress, progressText } =
            createProgressBar(diceId);
        longDiceContainer.prepend(progressWrapper);
        const remainingDice = NUM_OF_DICE - parseInt(diceId) - 1;
        const probability =
            calculateProbability(CURRENT_SUM, remainingDice) * 100;
        void progress.offsetHeight;
        progress.style.height = probability + "%";

        const currentGame = GAME_DATA[gameId];
        currentGame.probabilities.push({ diceId, probability });

        const duration = 1500;
        const start = performance.now();

        const animateText = (timestamp) => {
            const elapsed = timestamp - start;
            const progressValue = Math.min(elapsed / duration, 1);
            const current = Math.floor(progressValue * probability);
            progressText.textContent = current + "%";
            const currentDiceContainer = document.querySelector(
                `#long-container${parseInt(diceId)}`
            );
            if (currentDiceContainer) {
                const chanceText = document.querySelector(".chance-text");
                if (chanceText) {
                    currentDiceContainer
                        .querySelector(".progress-wrapper")
                        .prepend(chanceText);
                }
            }

            let factor = Math.pow(current / 100, 2.0);
            const min = 0.0;
            const max = 0.9;
            factor = min + factor * (max - min);

            const color = interpolateColor("#2fc9ff", "#012060", factor);
            progress.style.backgroundColor = color;

            if (progressValue < 1) {
                requestAnimationFrame(animateText);
            } else {
                const loaderDuration = 2000;

                addLoading(loaderDuration, rollBtn, diceId);

                setTimeout(() => {
                    rollBtn.disabled = false;
                    if (remainingDice <= 0) {
                        const resultText = createGeneralElement(
                            "h1",
                            ["result-text"],
                            "result-text"
                        );
                        const isWin = CURRENT_SUM >= 21;
                        resultText.innerText = isWin ? "You Won!" : "You Lost!";
                        resultText.style.textAlign = "center";
                        resultText.style.marginBottom = "20px";
                        resultText.style.fontSize = "32px";
                        resultText.style.color = isWin ? "#2fc9ff" : "#ff2f2f";
                        app.prepend(resultText);

                        progress.style.height = isWin ? "100%" : "0%";
                        progressText.textContent = isWin ? "100%" : "0%";

                        GAME_DATA[gameId].sum = CURRENT_SUM;
                        GAME_DATA[gameId].result = isWin ? "win" : "loss";

                        rollBtn.innerText = "Continue";
                        rollBtn.removeEventListener("click", () =>
                            randomDice(dice, rollBtn)
                        );
                        rollBtn.addEventListener("click", () => {
                            showSliderScreen(gameId);
                        });
                    }
                }, loaderDuration);
            }
        };

        requestAnimationFrame(animateText);
    }, 3000);
}

function createCircle(color, left, isMovable = false) {
    const circle = createGeneralElement(
        "div",
        ["circle-slider", `${color}`],
        isMovable ? "sliderThumb" : ""
    );
    circle.style.left = left;
    return circle;
}

function createLabel(text, left) {
    const label = createGeneralElement("div", ["label"]);
    label.textContent = text;
    label.style.left = left;
    return label;
}

function createCustomSlider(app, gameId) {
    const parent = createGeneralElement(
        "div",
        ["slider-parent"],
        "slider-parent"
    );
    const title = createGeneralElement("h2", [], "slider-title");
    title.textContent = "How happy are you at this moment?";

    const sliderContainer = createGeneralElement(
        "div",
        ["slider-container"],
        "sliderContainer"
    );

    const track = createGeneralElement("div", ["slider-track"], "sliderTrack");
    const thumb = createCircle("yellow", "50%", true);
    const sliderElements = [
        track,
        createCircle("black", "0%"),
        createLabel("very unhappy", "0%"),
        createCircle("black", "100%"),
        createLabel("very happy", "100%"),
        thumb,
    ];

    sliderElements.forEach((element) => {
        sliderContainer.appendChild(element);
    });

    const button = createGeneralElement("button", ["roll"], "continueBtn");
    button.textContent = "Continue";
    button.disabled = true;

    const reminder = createGeneralElement("div", ["reminder"], "reminderText");
    reminder.textContent =
        "Please move the slider according to the instructions";

    // app.classList.add("slider-page");

    const elements = [title, sliderContainer, button, reminder];
    elements.forEach((element) => {
        parent.appendChild(element);
    });

    let hasMoved = false;
    let reminderTimeout = setTimeout(() => {
        if (!hasMoved) {
            reminder.style.display = "block";
        }
    }, 4000);

    let currentSliderValue = 50;

    thumb.addEventListener("mousedown", (e) => {
        e.preventDefault();
        thumb.style.transition = "none";
        if (!hasMoved) {
            hasMoved = true;
            button.disabled = false;
            reminder.style.display = "none";
            clearTimeout(reminderTimeout);
        }

        const rect = sliderContainer.getBoundingClientRect();
        const thumbWidth = thumb.offsetWidth;

        const onMouseMove = (moveEvent) => {
            moveEvent.preventDefault();
            let x = moveEvent.clientX - rect.left;
            x = Math.max(0, Math.min(rect.width, x));
            const percent = (x / rect.width) * 100;
            thumb.style.left = `calc(${percent}% - ${thumbWidth / 2}px)`;
            currentSliderValue = Math.round(percent);
        };

        const onMouseUp = () => {
            thumb.style.transition = "left 0.2s ease";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    button.addEventListener("click", () => {
        const currentGame = GAME_DATA[gameId];
        currentGame.surveyResult = currentSliderValue;
        startNextGame();
    });

    return parent;
}

function createGameArray(numOfGames, numOfDice) {
    return Array.from({ length: numOfGames }, (_, i) => i + 1).map((num) => {
        return {
            id: `game${num}`,
            diceResults: Array.from(
                { length: numOfDice },
                () => Math.floor(Math.random() * 6) + 1
            ),
        };
    });
}

const IS_REAL = false;
const NUM_OF_DICE = 6;
const NUM_OF_GAMES = 5;
let CURRENT_SUM = 0;
const GAME_LIST = IS_REAL
    ? createGameArray(NUM_OF_GAMES, NUM_OF_DICE)
    : _.shuffle(PREPARED_GAME_LIST);
let CURRENT_GAME = GAME_LIST[0];
const GAME_DATA = {};
const body = document.querySelector("body");
const app = createGeneralElement("div", ["app"], "app");
body.append(app);

function showDiceScreen() {
    app.innerHTML = "";
    app.classList.remove("slider-page");

    const gameId = CURRENT_GAME.id;
    GAME_DATA[gameId] = {
        gameId: gameId,
        diceResults: CURRENT_GAME.diceResults,
        probabilities: [],
    };

    const dices = createArray(NUM_OF_DICE).map((num) => {
        return { dice: createDiceElement(num), id: num };
    });
    const rollBtn = createButton("roll", ["roll"], "Roll Dice");
    rollBtn.addEventListener("click", () => {
        const dice = dices ? dices.shift() : null;
        const diceElement = dice ? dice.dice : null;
        const diceId = dice ? dice.id : null;
        return randomDice(diceElement, diceId, rollBtn, gameId);
    });

    const wideContainerDices = createContainer("dices", "wide");
    const wideContainerBtn = createContainer("btn", "wide");
    const longContainerBtn = createContainer("btn", "long");
    longContainerBtn.classList.add("spaced");
    longContainerBtn.append(rollBtn);
    wideContainerBtn.append(longContainerBtn);

    const preStartElement = createPreStartElement();
    wideContainerDices.append(preStartElement);

    dices.forEach((dice, ind) => {
        const longContainer = createContainer(ind, "long");
        const container = createContainer(ind, "normal");
        container.append(dice.dice);
        longContainer.append(container);
        wideContainerDices.append(longContainer);
        if (ind === 0) return;
        longContainer.classList.add("disable");
    });
    app.append(wideContainerDices);
    app.append(wideContainerBtn);
}

function showSliderScreen(gameId) {
    app.innerHTML = "";
    app.classList.add("slider-page");

    const slider = createCustomSlider(app, gameId);
    app.append(slider);
}

function startNextGame() {
    GAME_LIST.shift();

    if (GAME_LIST.length > 0) {
        CURRENT_GAME = GAME_LIST[0];
        CURRENT_SUM = 0;
        showDiceScreen();
    } else {
        app.innerHTML = "";
        app.classList.remove("slider-page");

        const completionMessage = createGeneralElement(
            "h1",
            ["completion-message"],
            "completion-message"
        );

        const completionMessageContainer = createGeneralElement(
            "div",
            ["completion-message-container"],
            "completion-message-container"
        );
        completionMessage.innerText = "All games completed!";
        completionMessageContainer.append(completionMessage);
        app.append(completionMessageContainer);
        console.log("GAME_DATA", GAME_DATA);
        window.postMessage(GAME_DATA, "*");
    }
}

showDiceScreen();
