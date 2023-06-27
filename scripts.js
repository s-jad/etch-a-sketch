// DOM Elements
const gridContainer = document.getElementById("grid-container");
const inputBox = document.getElementById("input-grid-size");
const submitInputButton = document.getElementById("btn-make-grid");
const customMenu = document.getElementById("custom-menu");
const menuHeader = document.getElementById("menu-header");

const root = document.documentElement;

// FUNCTIONS

function handleUserPreferences() {
    // Setup board
    handleMenuGridSize();
    handleMenuStartingColor();
    setKeyboardEventListeners();
    setMouseEventListeners();

    // Transition to board
    hideCustomMenu();
    showBoard();
    setInterval(hideMenu, 99);
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

    // Style grid columns to accomodate the exact number of created children
    gridContainer.style.gridTemplateColumns = `repeat(${inputSize}, min(${80 / inputSize}vw, ${80 / inputSize}vh))`;
    gridContainer.style.gap = `min(0.4rem, ${4 / inputSize}rem)`;
    console.log(`calculated width of GTC: ${gridContainer.style.gridTemplateColumns}`);

}


// Show / Hide Functions
function showCustomMenu() {
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
function setMouseEventListeners() {
    const boardSquares = document.querySelectorAll(".sketch-board");
    const computedStyle = getComputedStyle(root);
    let leftMouseDown = false;
    let rightMouseDown = false;

    boardSquares.forEach(square => {
        square.addEventListener("mousedown", function(event) {
            // Check which mouse button is being held down
            if (event.button === 0) {
                // Prevent element dragging behaviour
                event.preventDefault();

                // Left mouse button is being held down
                leftMouseDown = true;

                // shiftKeyDown = true -> activates the "eraser"
                // shiftKeyDown = false -> activates the "pencil"
                if (shiftKeyDown) {
                    this.style.background = `${computedStyle.getPropertyValue('--bg-squares')}`;
                } else {
                    this.style.background = `${computedStyle.getPropertyValue('--starting-color')}`;
                }
            } else if (event.button === 2) {
                // Right mouse button is being held down
                event.preventDefault();
                rightMouseDown = true;
            }
        });

        square.addEventListener("mouseover", function(event) {
            if (event.button === 0 && leftMouseDown) {
                // Left mouse button is being held down
                if (shiftKeyDown) {
                    this.style.background = `${computedStyle.getPropertyValue('--bg-squares')}`;
                } else {
                    this.style.background = `${computedStyle.getPropertyValue('--starting-color')}`;
                }
                console.log("Left mouse button is held down");
            } else if (event.button === 2 && rightMouseDown) {
                // Right mouse button is being held down
                this.style.background = `${computedStyle.getPropertyValue('--bg-squares')}`;
                console.log("Right mouse button is held down");
            }
        });

    });

    gridContainer.addEventListener("mousedown", function(event) {
        // Check which mouse button is being held down
        if (event.button === 0) {
            // Left mouse button is being held down
            leftMouseDown = true;
        } else if (event.button === 2) {
            // Right mouse button is being held down
            event.preventDefault();
            rightMouseDown = true;
            console.log("Right mouse button is being held down")
        }
    });

    gridContainer.addEventListener("mouseup", function(event) {
        if (event.button === 0) {
            leftMouseDown = false;
            console.log("Left mouse button released");
        } else if (event.button === 2) {
            rightMouseDown = false;
            console.log("Right mouse button released");
        }
    });
}

let shiftKeyDown = false;

function setKeyboardEventListeners() {
    // Detect shift key being held down
    document.addEventListener("keydown", function(event) {
        if (event.key = "Shift") {
            // Shift key is being held down
            shiftKeyDown = true;
            console.log("Shift key is held down");
        }
    });

    // Detect shift key being released
    document.addEventListener("keyup", function(event) {
        if (event.key = "Shift") {
            // Shift key is released
            shiftKeyDown = false;
            console.log("Shift key is released");
        }
    });
}

// Prevent the default context menu from appearing within the grid
gridContainer.addEventListener("contextmenu", function(event) {
    event.preventDefault();
});

// Utility Functions
function hexToHSL(hex) {
    // Extract the red, green, and blue values from the hex color code 
    // using a regular expression and store them in the 'result' array
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    // Convert the hexadecimal values to decimal values 
    // Store them in separate variables
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    // Normalize RGB values by dividing them by 255
    r /= 255, g /= 255, b /= 255;

    // Calculate the maximum and minimum values of the RGB components
    // Calculate the lightness (l) as the average of the max and min
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        // Calculate the saturation (s) 
        // Based on the difference between max and min, and the lightness value
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        // Calculate the hue (h) 
        // Based on the value of max and the differences between the RGB components
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        // Normalize the hue value to be between 0 and 1
        h /= 6;
    }

    // Convert: hue value to degrees, saturation and lightness values to percentages
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return { h, s, l };
}

