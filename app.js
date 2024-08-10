
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
const startButton = document.querySelector('#welcome-screen a[href="#game-board"]'); // Select the link with href="#game-board"

startButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none'; // Hide the welcome screen
    gameBoard.style.display = 'block'; // Show the game board
    gridContainer.style.display = 'grid'; // Show the grid

    // Initialize the game
    initGame();
});

// Function to initialize the game
function initGame() {

}