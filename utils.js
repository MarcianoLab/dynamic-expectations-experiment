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
    const className = containerType + "-container";
    const container = createGeneralElement("div", [className], className + id);
    return container;
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
    progress.appendChild(progressText);
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
    const normalContainer = "#normal-container";
    const longContainer = "#long-container";
    const currentNormalDiceContainer = document.querySelector(
        normalContainer + diceId
    );
    const nextLongDiceContainer = document.querySelector(
        longContainer + `${Number(diceId) + 1}`
    );
    const nextNormalDiceContainer = document.querySelector(
        normalContainer + `${Number(diceId) + 1}`
    );
    currentNormalDiceContainer.classList.add("disable");
    if (!nextLongDiceContainer) return;
    nextLongDiceContainer.classList.remove("disable");
    nextNormalDiceContainer.classList.remove("disable");
}

function addLoading(duration, rollBtn, diceId) {
    const rollBtnParent = rollBtn.parentElement;
    rollBtnParent.removeChild(rollBtn);
    const loader = createGeneralElement("div", ["loader"], "loader");
    const longContainerBtn = document.querySelector("#long-containerbtn");
    longContainerBtn.prepend(loader);

    setTimeout(() => {
        longContainerBtn.removeChild(loader);
        rollBtnParent.appendChild(rollBtn);
        setContainerDisable(diceId);
    }, duration);
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
    progress.appendChild(chanceText);
    longContainer.append(progressWrapper);
    container.append(circle);
    longContainer.append(container);

    longContainer.style.marginRight = "20px";

    const initialProbability = calculateProbability(0, NUM_OF_DICE) * 100;
    const maxHeight = window.innerHeight * 0.0035;
    progress.style.height = initialProbability * maxHeight + "px";
    progressText.textContent = Math.round(initialProbability) + "%";

    return longContainer;
}

function getRollResult(diceId) {
    const roll = CURRENT_GAME.diceResults[diceId];
    CURRENT_SUM += roll;
    return roll;
}

function randomDice(dice, rollBtn, gameId) {
    if (!dice) return;
    if (!IS_STARTED) {
        const preStartNormalContainer = document.querySelector(
            "#normal-containerpre-start"
        );
        preStartNormalContainer.classList.add("disable");
        IS_STARTED = true;
    }
    const diceId = dice.id.slice(-1);
    const random = getRollResult(diceId);
    const longDiceContainer = document.querySelector(
        "#long-container" + diceId
    );
    rollBtn.disabled = true;
    rollDice(random, dice);
    setTimeout(() => {
        const { progressWrapper, progress, progressText } =
            createProgressBar(diceId);
        longDiceContainer.prepend(progressWrapper);
        const remainingDice = NUM_OF_DICE - parseInt(diceId) - 1;
        const probability =
            calculateProbability(CURRENT_SUM, remainingDice) * 100;
        const maxHeight = window.innerHeight * 0.0035;
        void progress.offsetHeight;
        progress.style.height = probability * maxHeight + "px";

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
                        .querySelector(".progress")
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
                        resultText.style.position = "absolute";
                        resultText.style.top = "40px";

                        resultText.style.fontSize = "32px";
                        resultText.style.color = isWin ? "#2fc9ff" : "#ff2f2f";
                        app.prepend(resultText);
                        const maxHeight = window.innerHeight * 0.0035;
                        progress.style.height = isWin
                            ? 100 * maxHeight + "px"
                            : "0px";
                        progressText.textContent = isWin ? "100%" : "0%";

                        GAME_DATA[gameId].sum = CURRENT_SUM;
                        GAME_DATA[gameId].result = isWin ? "win" : "loss";
                        IS_STARTED = false;
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
