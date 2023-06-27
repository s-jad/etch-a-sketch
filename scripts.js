// DOM Elements
const gridContainer = document.getElementById("grid-container");
const inputBox = document.getElementById("input-grid-size");
const submitInputButton = document.getElementById("btn-make-grid");
const customMenu = document.getElementById("custom-menu");
const menuHeader = document.getElementById("menu-header");


const root = document.documentElement;

// FUNCTIONS

function handleUserPreferences() {
    handleMenuGridSize();
    handleMenuStartingColor();
    hideCustomMenu();
    showBoard();
    setInterval(hideMenu, 99);
    setBoardEventListeners();
}

// Calculate grid container and grid element sizes from user input
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


// Show / Hide Functions
function showCustommenu() {
    customMenu.style.display = "flex";
}

function hideCustomMenu() {
    customMenu.style.display = "none";
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
}

// menu Handlers
function handleMenuGridSize() {
    const input = document.getElementById("menuGridSize");
    let inputSize = parseInt(input.value);

    sizeGrid(inputSize);
}

function handleMenuStartingColor() {
    const input = document.getElementById("menuStartingColor");
    if (!input.value) {
        return;
    }

    const { h, s, l } = hexToHSL(input.value)

    root.style.setProperty('--starting-color', `hsl(${h}, ${s}%, ${l}%)`);
    root.style.setProperty('--bg-light', `hsl(${h}, ${s / 4}%, ${l + 30 >= 90 ? 90 : l + 30}%)`);
    root.style.setProperty('--bg-squares', `hsl(${h}, ${s * 1.3}%, ${l - 15}%)`);
    root.style.setProperty('--shadow-light', `hsl(${h}, ${s / 4}%, ${l + 20 >= 90 ? 90 : l + 20}%)`);
    root.style.setProperty('--shadow-dark', `hsl(${h}, ${s * 1.5 >= 85 ? 85 : l * 1.5}%, 5%)`);
    root.style.setProperty('--font-color', `hsl(${h}, ${s * 1.6 >= 95 ? 95 : l * 1.6}%, 3%)`);
}

// EVENT LISTENERS   
function setBoardEventListeners() {
    const boardSquares = document.querySelectorAll(".sketch-board");
    const computedStyle = getComputedStyle(root);
    let leftMouseDown = false;
    let rightMouseDown = false;

    boardSquares.forEach(square => {
        square.addEventListener("mousedown", function(event) {
            // Check which mouse button is being held down
            if (event.button === 0) {
                // Left mouse button is being held down
                leftMouseDown = true;
                this.style.background = `${computedStyle.getPropertyValue('--starting-color')}`;
                console.log("Left mouse button is held down");
            } else if (event.button === 2) {
                // Right mouse button is being held down
                event.preventDefault();
                rightMouseDown = true;
                console.log("Right mouse button is held down");
                this.style.background = `${computedStyle.getPropertyValue('--bg-squares')}`;
            }
        });

        square.addEventListener("mouseover", function(event) {
            if (!leftMouseDown && !rightMouseDown) {
                // If neither is held down, no need to go further
                return;
            }

            if (event.button === 0 && leftMouseDown) {
                // Left mouse button is being held down
                this.style.background = `${computedStyle.getPropertyValue('--starting-color')}`;
                console.log("Left mouse button is held down");
            } else if (event.button === 2 && rightMouseDown) {
                // Right mouse button is being held down
                event.preventDefault();
                console.log("Right mouse button is held down");
                this.style.background = `${computedStyle.getPropertyValue('--bg-squares')}`;
            }
        });

        square.addEventListener("mouseup", function(event) {
            if (event.button === 0) {
                leftMouseDown = false;
            } else if (event.button === 2) {
                rightMouseDown = false;
            }

        });
    });
}

function setKeyboardEventListeners() {
    // Detect shift key being held down
    document.addEventListener("keydown", function(event) {
        if (event.shiftKey) {
            // Shift key is being held down
            console.log("Shift key is held down");
        }
    });

    // Detect shift key being released
    document.addEventListener("keyup", function(event) {
        if (event.key === "Shift") {
            // Shift key is released
            console.log("Shift key is released");
        }
    });
}

gridContainer.addEventListener("contextmenu", function(event) {
    // Prevent the default context menu from appearing within the grid
    event.preventDefault();
});

// Utility Functions

function hexToHSL(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return { h, s, l };
}
