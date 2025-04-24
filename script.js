IS_REAL = false;
NUM_OF_DICE = 6;
CURRENT_SUM = 0;
GAME_LIST = _.shuffle(GAME_LIST);
CURRENT_GAME = GAME_LIST[0];
const SURVEY_RESULT = [];
const body = document.querySelector("body");
const app = createGeneralElement("div", ["app"], "app");
body.append(app);

function showDiceScreen() {
    app.innerHTML = "";
    app.classList.remove("slider-page");
    const dices = createArray(NUM_OF_DICE).map((num) => {
        return createDiceElement(num);
    });
    const rollBtn = createButton("roll", ["roll"], "Roll Dice");
    rollBtn.addEventListener("click", () =>
        randomDice(dices ? dices.shift() : null, rollBtn)
    );

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
        container.append(dice);
        longContainer.append(container);
        wideContainerDices.append(longContainer);
        if (ind === 0) return;
        longContainer.classList.add("disable");
    });
    app.append(wideContainerDices);
    app.append(wideContainerBtn);
}

function showSliderScreen() {
    app.innerHTML = "";
    app.classList.add("slider-page");

    const slider = createCustomSlider(app);
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
    }
}

showDiceScreen();
