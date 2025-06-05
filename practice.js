const IS_REAL = false;
const NUM_OF_DICE = 6;
const NUM_OF_GAMES = 1;
let CURRENT_SUM = 0;
const GAME_LIST = [PRACTICE_GAME];
let CURRENT_GAME = GAME_LIST[0];
const GAME_DATA = {};
let IS_STARTED = false;
const body = document.querySelector("body");
const app = createGeneralElement("div", ["app"], "app");
body.append(app);

function showDiceScreen() {
    app.innerHTML = "";
    app.classList.remove("slider-page");
    document.body.classList.add("body-style");
    document.body.style.backgroundColor = "#dddddd";
    document.body.style.height = "100vh";
    const qualtricsElements = document.getElementsByClassName("SkinInner")[0];
    console.log("qualtricsElements", qualtricsElements);
    if (qualtricsElements) {
        qualtricsElements.style.backgroundColor = "#dddddd";
    }

    const gameId = CURRENT_GAME.id;
    GAME_DATA[gameId] = {
        gameId: gameId,
        diceResults: CURRENT_GAME.diceResults,
        probabilities: [],
    };
    const numArray = [];
    for (let i = 0; i < NUM_OF_DICE; i++) {
        numArray.push(i);
    }
    const dices = numArray.map((num) => {
        return createDiceElement(num);
    });

    const rollBtn = createButton("roll", ["roll"], "Roll Dice");
    rollBtn.addEventListener("click", () => {
        return randomDice(dices ? dices.shift() : null, rollBtn, gameId);
    });

    const wideContainerDices = createContainer("dices", "wide");
    const wideContainerBtn = createContainer("btn", "wide");
    const longContainerBtn = createContainer("btn", "long");

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
        addCurrentScore(ind, longContainer);
        if (ind === 0) return;
        longContainer.classList.add("disable");
    });
    app.append(wideContainerDices);
    app.append(wideContainerBtn);
}

function showSliderScreen(gameId) {
    app.innerHTML = "";
    app.classList.add("slider-page");

    const slider = createCustomSlider(gameId);
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
        window.postMessage("next", "*");
    }
}

showDiceScreen();
