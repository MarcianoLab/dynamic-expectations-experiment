function createArray(length) {
    return Array.from({ length }, (_, i) => i);
}

function createWideContainer(id) {
    const wideContainer = document.createElement("div");
    wideContainer.classList.add("wide-container");
    wideContainer.id = id;
    return wideContainer;
}

function createProgressBar(id) {
    const progressWrapper = document.createElement("div");
    progressWrapper.classList.add("progress-wrapper");
    progressWrapper.id = "progress-wrapper" + id;
    const progress = document.createElement("div");
    progress.classList.add("progress");
    progress.id = "progress" + id;
    progressWrapper.appendChild(progress);
    const progressText = document.createElement("div");
    progressText.classList.add("progress-text");
    progressText.id = "progress-text" + id;
    progressText.innerText = "0%";
    progressWrapper.appendChild(progressText);
    return { progressWrapper, progress, progressText };
}

function createDiceElement(id) {
    const dice = document.createElement("div");
    dice.classList.add("dice");
    const faces = ["front", "back", "left", "right", "top", "bottom"];
    faces.forEach((face, _) => {
        const faceDiv = document.createElement("div");
        faceDiv.classList.add("face", `${face}`);
        dice.appendChild(faceDiv);
    });
    dice.id = id;
    return dice;
}

function createButton(id, text, classes = []) {
    const button = document.createElement("button");
    button.classList.add(...classes);
    button.id = id;
    button.innerText = text;
    return button;
}
const randomDice = (dice) => {
    const random = Math.floor(Math.random() * 6) + 1; // Ensure it's always 1-6
    rollDice(random, dice);
    setTimeout(() => {
    const diceId = dice.id.slice(-1);
    const { progressWrapper, progress, progressText } =
        createProgressBar(diceId);
    const longDiceContainer = document.querySelector(
        "#long-container" + diceId
    );
    longDiceContainer.prepend(progressWrapper);
    let randomPercentage = Math.floor(Math.random() * 100);
    let currentProgress = 0;
    const interval = setInterval(() => {
        if (currentProgress >= randomPercentage) {
            clearInterval(interval);
        } else {
            currentProgress++;
            progress.style.height = currentProgress + "%";
            progressText.textContent = currentProgress + "%";
        }
    }, 10);
    // progress.style.height = randomPercentage + "%";
    // progressText.textContent = randomPercentage + "%";
    }, 3000);
};

const rollDice = (random, dice) => {
    const xRotation = 720 + Math.random() * 360; // Random extra rotations
    const yRotation = 720 + Math.random() * 360;

    dice.style.animation = "none"; // Reset animation
    dice.style.transition = "transform 2s ease-out"; // Smooth rolling

    setTimeout(() => {
        dice.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    }, 50);

    setTimeout(() => {
        setFinalPosition(random, dice);
    }, 2000);
};

const setFinalPosition = (random, dice) => {
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
};
