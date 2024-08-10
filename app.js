
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
        // Finding all the empty cells (cells with a value of 0) in the grid and storing their row and column indices in the emptyCells array.
        // If there are any empty cells, we choose one randomly using Math.random().
        // We then set the value of the chosen cell to either 2 or 4, with a 90% probability of it being 2.
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
    function renderGrid() {
    }
}