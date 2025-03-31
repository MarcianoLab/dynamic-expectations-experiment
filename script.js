NUM_OF_DICE = 6;
const dices = createArray(NUM_OF_DICE).map((num) => {
    return createDiceElement(`dice${num}`);
});
let currentButton = dices[0];
const rollBtn = createButton("btn", "Roll Dice", ["roll"]);
rollBtn.addEventListener("click", () => randomDice(currentButton));

const body = document.querySelector("body");

dices.forEach((dice, ind) => {
    const longContainer = document.createElement("div");
    longContainer.classList.add("long-container");
    longContainer.id = `long-container${ind}`;
    const container = document.createElement("div");
    container.classList.add("container");
    container.id = `container${ind}`;
    container.append(dice);
    longContainer.append(container);
    body.append(longContainer);
    if (ind === 0) return;
    longContainer.classList.add("disable");
});
const wideContainerBtn = createWideContainer;
const wideContainerDices = document.createElement("div");
wideContainerBtn.classList.add("wide-container");
wideContainerDices.classList.add("wide-container");
wideContainer.id = "wide-container";
wideContainer.append(rollBtn);
body.append(wideContainer);