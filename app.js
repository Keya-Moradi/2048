// Get references to important elements on the page
const welcomeScreen = document.getElementById('welcome-screen'); // Welcome screen element
const gameBoard = document.getElementById('game-board'); // Game board element
const gridContainer = document.getElementById('grid-container'); // Grid container for tiles
const scoreDisplay = document.getElementById('score'); // Score display element
const restartButton = document.getElementById('restart-button'); // Restart button
const instructionsButton = document.getElementById('show-instructions'); // Instructions button
const gameInstructions = document.getElementById('game-instructions'); // Instructions element
const backToWelcomeButtonFromInstructions = document.getElementById('back-to-welcome-from-instructions'); // Back button from instructions
const backToWelcomeButtonFromGame = document.getElementById('back-to-welcome-from-game'); // Back button from game

// Set up game variables
let grid = []; // 2D array to represent the game board
let score = 0; // Current score

// Show/hide game instructions when the instructions button is clicked
instructionsButton.addEventListener('click', () => {
    // Toggle the display of the game instructions
    gameInstructions.style.display = (gameInstructions.style.display === 'none') ? 'block' : 'none';
    // Show/hide the "Back to Welcome Page" button in the instructions
    if (gameInstructions.style.display === 'block') {
        backToWelcomeButtonFromInstructions.style.display = 'block';
    } else {
        backToWelcomeButtonFromInstructions.style.display = 'none';
    }
});

// Restart the game when the "Restart" button is clicked
restartButton.addEventListener('click', () => {
    // Reset the game state
    grid = [];
    score = 0;

    // Hide win/lose messages
    document.getElementById('win-message').style.display = 'none';
    document.getElementById('lose-message').style.display = 'none';

    // Re-initialize the game
    initGame();
});

// Handle clicks on the "Back to Welcome Page" button from instructions
backToWelcomeButtonFromInstructions.addEventListener('click', () => {
    // Hide the game instructions
    gameInstructions.style.display = 'none';

    // Show the welcome screen
    welcomeScreen.style.display = 'block';

    // Hide both "Back to Welcome Page" buttons
    backToWelcomeButtonFromInstructions.style.display = 'none';
    backToWelcomeButtonFromGame.style.display = 'none';

    // Hide win/lose messages
    document.getElementById('win-message').style.display = 'none';
    document.getElementById('lose-message').style.display = 'none';
});

// Handle clicks on the "Back to Welcome Page" button from the game
backToWelcomeButtonFromGame.addEventListener('click', () => {
    // Hide the game board
    gameBoard.style.display = 'none';

    // Show the welcome screen
    welcomeScreen.style.display = 'block';

    // Hide both "Back to Welcome Page" buttons
    backToWelcomeButtonFromInstructions.style.display = 'none';
    backToWelcomeButtonFromGame.style.display = 'none';

    // Reset game state
    grid = [];
    score = 0;

    // Render the initial grid
    renderGrid();
});

// Start the game when "Let's Play!" is clicked
// Select the link with href="#game-board"
const startButton = document.querySelector('#welcome-screen a[href="#game-board"]');
startButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    // Hide the welcome screen
    welcomeScreen.style.display = 'none';
    // Show the game board
    gameBoard.style.display = 'block';
    // Show the "Back to Welcome Page" button
    backToWelcomeButtonFromGame.style.display = 'block'; // Ensure this button is visible
    // Initialize the game
    initGame();
});

// Function to initialize the game:
// 1. Create the 4x4 grid by initializing a 2D array called grid with zeros.
// 2. Call the addTile function twice to add two initial tiles.
// 3. Reset the score to 0 and update the score display.
// 4. Call the renderGrid function to display the initial grid on the screen.
function initGame() {
    // Clear the grid and reset
    grid = [];
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

// Function to update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = score; // Update the score text content
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
            const tile = document.createElement('div'); // Create a new div for the tile
            tile.classList.add('tile'); // Add the tile class for styling
            if (tileValue > 0) {
                tile.textContent = tileValue; // Set the tile's text content if it's not empty
            }
            gridContainer.appendChild(tile); // Add the tile to the grid container
        }
    }
}

// Function to handle keyboard events
// Handle user input (arrow keys)
document.addEventListener('keydown', (event) => {
    // Check if the pressed key is an arrow key
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        // Prevent default behavior for arrow keys
        event.preventDefault();

        if (event.key === 'ArrowUp') {
            moveUp();
        } else if (event.key === 'ArrowDown') {
            moveDown();
        } else if (event.key === 'ArrowLeft') {
            moveLeft();
        } else if (event.key === 'ArrowRight') {
            moveRight();
        }

        // After each move, check for win/lose conditions and add a new tile
        checkWinLose();
        addTile();
        renderGrid(); // Re-render the grid to reflect the changes
    }
});

// Game Logic: 
// 1. Movement
// 2. Win/Lose
// 3. Updating the score accordingly

// Functions to handle movement in each direction
// Does NOT account for more complex scenarios, such as:
// A. Merging multiple tiles in a row
// B. Preventing tiles from merging twice in the same move.

// Function to handle upward movement of tiles
function moveUp() {
    let moved = false; // Flag to track if any tiles moved
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 3; row++) {
            if (grid[row][col] === 0) { // If the current tile is empty
                for (let nextRow = row + 1; nextRow < 4; nextRow++) {
                    if (grid[nextRow][col] !== 0) { // Find the next non-empty tile below
                        grid[row][col] = grid[nextRow][col]; // Move it up
                        grid[nextRow][col] = 0; // Empty the original cell
                        moved = true;
                        break; // Stop searching once a tile is moved
                    }
                }
            } else if (grid[row][col] === grid[row + 1][col]) { // If the current tile can merge with the one below
                grid[row][col] *= 2; // Double the value
                grid[row + 1][col] = 0; // Empty the cell below
                score += grid[row][col]; // Update the score
                moved = true;
                updateScoreDisplay(); // Call the function to update the score display
            }
        }
    }
    return moved; // Return true if any tiles moved
}

// Function to handle downward movement of tiles
function moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
        for (let row = 3; row > 0; row--) { // Loop from bottom to top
            if (grid[row][col] === 0) {
                for (let nextRow = row - 1; nextRow >= 0; nextRow--) { // Find the next non-empty tile above
                    if (grid[nextRow][col] !== 0) {
                        grid[row][col] = grid[nextRow][col];
                        grid[nextRow][col] = 0;
                        moved = true;
                        break;
                    }
                }
            } else if (grid[row][col] === grid[row - 1][col]) { // Merge with the tile above
                grid[row][col] *= 2;
                grid[row - 1][col] = 0;
                score += grid[row][col];
                moved = true;
                updateScoreDisplay(); // Call the function to update the score display
            }
        }
    }

    return moved;
}

// Function to handle leftward movement of tiles
function moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
            if (grid[row][col] === 0) {
                for (let nextCol = col + 1; nextCol < 4; nextCol++) { // Find the next non-empty tile to the right
                    if (grid[row][nextCol] !== 0) {
                        grid[row][col] = grid[row][nextCol];
                        grid[row][nextCol] = 0;
                        moved = true;
                        break;
                    }
                }
            } else if (grid[row][col] === grid[row][col + 1]) { // Merge with the tile to the right
                grid[row][col] *= 2;
                grid[row][col + 1] = 0;
                score += grid[row][col];
                moved = true;
                updateScoreDisplay(); // Call the function to update the score display
            }
        }
    }

    return moved;
}

// Function to handle rightward movement of tiles
function moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
        for (let col = 3; col > 0; col--) { // Loop from right to left
            if (grid[row][col] === 0) {
                for (let nextCol = col - 1; nextCol >= 0; nextCol--) { // Find the next non-empty tile to the left
                    if (grid[row][nextCol] !== 0) {
                        grid[row][col] = grid[row][nextCol];
                        grid[row][nextCol] = 0;
                        moved = true;
                        break;
                    }
                }
            } else if (grid[row][col] === grid[row][col - 1]) { // Merge with the tile to the left
                grid[row][col] *= 2;
                grid[row][col - 1] = 0;
                score += grid[row][col];
                moved = true;
                updateScoreDisplay(); // Call the function to update the score display
            }
        }
    }

    return moved;
}

// Function to check for win/lose conditions
// 1. Looping through the entire grid to see if any tile has a value of 2048. If so, the player wins!
// 2. If there's no winning tile, we loop through the grid again to check for any possible moves.
// 3. If there's an empty cell, the game is not over yet.
// 4. If there are adjacent tiles with the same value (either vertically or horizontally), there's a potential merge, so the game is not over.
// 5. If no empty cells or potential merges are found, the player loses!
function checkWinLose() {
    // Check for a win
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 2048) { // If any tile has the value 2048, the player wins
                document.getElementById('win-message').style.display = 'block'; // Show the win message
                return; // Exit the function since the game is over
            }
        }
    }

    // Check for a loss (no more moves possible)
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) { // If there's an empty cell, the game is not over
                return; // Exit the function
            }
            if (i < 3 && grid[i][j] === grid[i + 1][j]) { // Check for potential merges vertically
                return; // Exit the function
            }
            if (j < 3 && grid[i][j] === grid[i][j + 1]) { // Check for potential merges horizontally
                return; // Exit the function
            }
        }
    }
    // If we reach this point, there are no empty cells or potential merges, so the player loses
    document.getElementById('lose-message').style.display = 'block'; // Show the lose message
}
