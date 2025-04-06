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

const randomDice = (dice, rollBtn) => {
    if (!dice) return;
    const random = Math.floor(Math.random() * 6) + 1;
    const diceId = dice.id.slice(-1);
    const longDiceContainer = document.querySelector(
        "#long-container" + diceId
    );
    rollBtn.disabled = true;
    rollDice(random, dice);

    setTimeout(() => {
        const { progressWrapper, progress, progressText } =
            createProgressBar(diceId);
        longDiceContainer.prepend(progressWrapper);
        let randomPercentage = Math.floor(Math.random() * 100);
        void progress.offsetHeight;
        progress.style.height = randomPercentage + "%";

        const duration = 1500;
        const start = performance.now();

        const animateText = (timestamp) => {
            const elapsed = timestamp - start;
            const progressValue = Math.min(elapsed / duration, 1);
            const current = Math.floor(progressValue * randomPercentage);
            progressText.textContent = current + "%";

            if (progressValue < 1) {
                requestAnimationFrame(animateText);
            } else {
                const loaderDuration = 3000;
                addLoading(loaderDuration);

                setTimeout(() => {
                    setContainerDisable(diceId);
                    rollBtn.disabled = false;
                }, loaderDuration);
            }
        };

        requestAnimationFrame(animateText);
    }, 3000);
};

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

function addLoading(duration) {
    const loader = createGeneralElement("div", ["loader"], "loader");
    const longContainerBtn = document.querySelector("#long-containerbtn");
    longContainerBtn.prepend(loader);
    setTimeout(() => {
        longContainerBtn.removeChild(loader);
    }, duration);
}

const rollDice = (random, dice) => {
    const xRotation = 720 + Math.random() * 360;
    const yRotation = 720 + Math.random() * 360;

    dice.style.animation = "none";
    dice.style.transition = "transform 2s ease-out";

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
