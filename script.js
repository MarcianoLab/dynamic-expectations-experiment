IS_REAL = false;
NUM_OF_DICE = 6;
CURRENT_SUM = 0;
GAME_LIST = _.shuffle(GAME_LIST);
CURRENT_GAME = GAME_LIST[0];
const dices = createArray(NUM_OF_DICE).map((num) => {
    return createDiceElement(num);
});
const rollBtn = createButton("roll", ["roll"], "Roll Dice");
rollBtn.addEventListener("click", () =>
    randomDice(dices ? dices.shift() : null, rollBtn)
);

const body = document.querySelector("body");
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
body.append(wideContainerDices);
body.append(wideContainerBtn);
