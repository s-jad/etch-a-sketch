// DOM Elements
const gridContainer = document.getElementById("grid-container");
const inputBox = document.getElementById("input-grid-size");
const submitInputButton = document.getElementById("btn-make-grid");

// FUNCTIONS
function sizeGrid(inputSize) {
    // Remove previous grid
    while (gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }

    // Use inputSize to create inputSize^2 divs
    for (let i = 0; i < inputSize * inputSize; i++) {
        let child = document.createElement('div');
        child.id = `child-${i + 1}`;
        child.classList.add("sketch-board");
        child.style.width = `min(${80 / inputSize}vw, ${80 / inputSize}vh)`;
        child.style.height = `min(${80 / inputSize}vw, ${80 / inputSize}vh)`;

        gridContainer.appendChild(child);
    }

    gridContainer.style.gridTemplateColumns = `repeat(${inputSize}, min(${80 / inputSize}vw, ${80 / inputSize}vh))`;
    gridContainer.style.gap = `min(0.4rem, ${4 / inputSize}rem)`;
    console.log(`calculated width of GTC: ${gridContainer.style.gridTemplateColumns}`);
}

// EVENT LISTENERS   
inputBox.addEventListener('keydown', (key) => {
    if (key.key === "Enter") {
        let inputSize = parseInt(inputBox.value);
        sizeGrid(inputSize);
    }
});

submitInputButton.addEventListener('click', () => {
    let inputSize = parseInt(inputBox.value);
    sizeGrid(inputSize);
})
