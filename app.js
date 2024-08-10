
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
    function addTile() {

    }
    // Function to render the grid to the DOM
    function renderGrid() {
    }
}