// DOM Elements
const gridContainer = document.getElementById("grid-container");
const inputBox = document.getElementById("input-grid-size");
const submitInputButton = document.getElementById("btn-make-grid");
const customPrompt = document.getElementById("custom-prompt");
const menuHeader = document.getElementById("menu-header");

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

function showCustomPrompt() {
    customPrompt.style.display = "flex";
}

function hideCustomPrompt() {
    customPrompt.style.display = "none";
}

function showBoard() {
    gridContainer.style.display = "grid";
}

function hideBoard() {
    gridContainer.style.display = "none";
}

function showMenu() {
    menuHeader.style.display = "flex";
}

function hideMenu() {
    menuHeader.classList.add("collapse");
    setInterval(() => {
        menuHeader.style.display = "none";
    }, 301);
}


function handlePromptInput() {
    const input = document.getElementById("promptInput");
    let inputSize = parseInt(input.value);

    hideCustomPrompt();
    showBoard();
    sizeGrid(inputSize);
    setInterval(hideMenu, 100);
}

// EVENT LISTENERS   

