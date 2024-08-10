
// Get references to important elements
const welcomeScreen = document.getElementById('welcome-screen');
const gameBoard = document.getElementById('game-board');
const gridContainer = document.getElementById('grid-container');
const scoreDisplay = document.getElementById('score');
const restartButton = document.getElementById('restart-button');
const instructionsButton = document.getElementById('show-instructions');
const gameInstructions = document.getElementById('game-instructions');

// Set up game variables
let grid = []; // 2D array to represent the game board
let score = 0;

// Show/hide game instructions
instructionsButton.addEventListener('click', () => {
    gameInstructions.style.display = (gameInstructions.style.display === 'none') ? 'block' : 'none';
});

// Start the game when "Lets Play!" is clicked
// Select the link with href="#game-board"
const startButton = document.querySelector('#welcome-screen a[href="#game-board"]');
startButton.addEventListener('click', () => {
    // Hide the welcome screen
    welcomeScreen.style.display = 'none';
    // Show the game board
    gameBoard.style.display = 'block';
    // Show the grid
    gridContainer.style.display = 'grid';
    // Initialize the game
    initGame();
});

// Function to initialize the game:
    // 1. Create the 4x4 grid by initializing a 2D array called a grid with zeros.
    // 2. Call the addTile function twice to add two initial tiles.
    // 3. Reset the score to 0 and update the score display.4. 
    // 4. Call the renderGrid function to display the initial grid on the screen.
function initGame() {
    // Create the 4x4 grid
    for (let i = 0; i < 4; i++) {
        let row = [];
        for (let j = 0; j < 4; j++) {
            row.push(0); // Initialize each cell with 0 (empty)
        }
        grid.push(row);
    }
    // Add two initial tiles
    addTile();
    addTile();
    // Update the score display
    score = 0;
    scoreDisplay.textContent = score;
    // Render the initial grid
    renderGrid();
}

// Function to add a new tile to the grid
    // 1. Finding all the empty cells (cells with a value of 0) in the grid and storing their row and column indices in the emptyCells array.
    // 2. If there are any empty cells, we choose one randomly using Math.random().
    // 3. We then set the value of the chosen cell to either 2 or 4, with a 90% probability of it being 2.
function addTile() {
    // Find all empty cells in the grid
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    // If there are empty cells, choose one randomly
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const { row, col } = emptyCells[randomIndex];

        // Set the value of the chosen cell to either 2 or 4 (with a higher probability for 2)
        // Generate a random number
        let randomValue = Math.random();

        // Check if the random number is less than 0.9
        if (randomValue < 0.9) {
            // 90% chance to set the tile to 2
            grid[row][col] = 2;
        } else {
            // 10% chance to set the tile to 4
            grid[row][col] = 4;
        }
    }
}

// Function to render the grid to the DOM
// 1. Clearing the gridContainer to remove any previously rendered tiles.
// 2. Looping through the grid array and creating a new div element for each tile.
// 3. Adding the class "tile" to each div so we can style it with CSS.
// 4. If the tile value is greater than 0 (i.e., not empty), we set the textContent of the div to the tile value.
// 5. Appending each tile div to the gridContainer.
function renderGrid() {
    gridContainer.innerHTML = ''; // Clear the grid container
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tileValue = grid[i][j];
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (tileValue > 0) {
                tile.textContent = tileValue;
            }
            gridContainer.appendChild(tile);
        }
    }
}

// Function to handle keyboard events
// Handle user input (arrow keys)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        moveUp();
    } else if (event.key === 'ArrowDown') {
        moveDown();
    } else if (event.key === 'ArrowLeft') {
        moveLeft();
    } else
        if (event.key === 'ArrowRight') {
            moveRight();

        }

    // After each move, check for win/lose conditions and add a new tile
    checkWinLose();
    addTile();
    renderGrid(); // Re-render the grid to reflect the changes
});

// Functions to handle movement in each direction
function moveUp() {

}

function moveDown() {

}

function moveLeft() {

}

function moveRight() {

}

// Function to check for win/lose conditions
function checkWinLose() {

}