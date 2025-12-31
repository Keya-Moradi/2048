/**
 * 2048 Game - Enhanced Version
 * A sliding puzzle game where the player combines numbered tiles to reach 2048
 *
 * Features:
 * - Proper tile movement and merging logic
 * - LocalStorage for game state and high score persistence
 * - Mobile touch/swipe support
 * - Undo functionality
 * - Animations
 * - Sound effects
 * - Continue after winning
 *
 * @author Keya Moradi
 * @version 2.0.0
 */

// ==================== CONSTANTS ====================

const GRID_SIZE = 4;
const TILE_SPAWN_PROBABILITY_2 = 0.9; // 90% chance for 2, 10% for 4
const WIN_TILE_VALUE = 2048;
const ANIMATION_DURATION = 200; // milliseconds
const DEBOUNCE_DELAY = 100; // milliseconds

// Storage keys
const STORAGE_KEYS = {
  GAME_STATE: 'game2048State',
  HIGH_SCORE: 'game2048HighScore',
  BEST_TILE: 'game2048BestTile'
};

// Direction constants
const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right'
};

// ==================== DOM ELEMENTS ====================

const elements = {
  welcomeScreen: document.getElementById('welcome-screen'),
  gameBoard: document.getElementById('game-board'),
  gridContainer: document.getElementById('grid-container'),
  scoreDisplay: document.getElementById('score'),
  highScoreDisplay: document.getElementById('high-score'),
  bestTileDisplay: document.getElementById('best-tile'),
  restartButton: document.getElementById('restart-button'),
  undoButton: document.getElementById('undo-button'),
  continueButton: document.getElementById('continue-button'),
  instructionsButton: document.getElementById('show-instructions'),
  gameInstructions: document.getElementById('game-instructions'),
  backToWelcomeFromInstructions: document.getElementById('back-to-welcome-from-instructions'),
  backToWelcomeFromGame: document.getElementById('back-to-welcome-from-game'),
  winMessage: document.getElementById('win-message'),
  loseMessage: document.getElementById('lose-message')
};

// ==================== GAME STATE ====================

let game = {
  grid: [],
  score: 0,
  highScore: 0,
  bestTile: 0,
  hasWon: false,
  canContinue: true,
  moveHistory: [],
  isAnimating: false,
  soundEnabled: true
};

// ==================== INITIALIZATION ====================

/**
 * Initialize the game when the page loads
 */
function init() {
  try {
    loadGameState();
    setupEventListeners();
    updateDisplays();
  } catch (error) {
    console.error('Error initializing game:', error);
    showError('Failed to initialize game. Please refresh the page.');
  }
}

/**
 * Load saved game state from localStorage
 */
function loadGameState() {
  const savedState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
  const savedHighScore = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
  const savedBestTile = localStorage.getItem(STORAGE_KEYS.BEST_TILE);

  game.highScore = savedHighScore ? parseInt(savedHighScore) : 0;
  game.bestTile = savedBestTile ? parseInt(savedBestTile) : 0;

  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      game.grid = state.grid;
      game.score = state.score;
      game.hasWon = state.hasWon || false;
    } catch (e) {
      console.warn('Could not load saved game state:', e);
    }
  }
}

/**
 * Save current game state to localStorage
 */
function saveGameState() {
  try {
    const state = {
      grid: game.grid,
      score: game.score,
      hasWon: game.hasWon
    };
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, game.highScore.toString());
    localStorage.setItem(STORAGE_KEYS.BEST_TILE, game.bestTile.toString());
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

// ==================== EVENT LISTENERS ====================

/**
 * Set up all event listeners for the game
 */
function setupEventListeners() {
  // Instructions toggle
  elements.instructionsButton.addEventListener('click', toggleInstructions);

  // Restart button
  elements.restartButton.addEventListener('click', restartGame);

  // Undo button
  if (elements.undoButton) {
    elements.undoButton.addEventListener('click', undoMove);
  }

  // Continue button (after winning)
  if (elements.continueButton) {
    elements.continueButton.addEventListener('click', continueAfterWin);
  }

  // Back buttons
  elements.backToWelcomeFromInstructions.addEventListener('click', backToWelcomeFromInstructions);
  elements.backToWelcomeFromGame.addEventListener('click', backToWelcomeFromGame);

  // Start game button
  const startButton = document.querySelector('#welcome-screen a[href="#game-board"]');
  if (startButton) {
    startButton.addEventListener('click', startGame);
  }

  // Keyboard controls with debouncing
  let keydownTimeout;
  document.addEventListener('keydown', (event) => {
    clearTimeout(keydownTimeout);
    keydownTimeout = setTimeout(() => handleKeyPress(event), DEBOUNCE_DELAY);
  });

  // Mobile touch controls
  setupTouchControls();
}

/**
 * Set up touch/swipe controls for mobile devices
 */
function setupTouchControls() {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const minSwipeDistance = 50;

  elements.gridContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  elements.gridContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX < minSwipeDistance && absDeltaY < minSwipeDistance) {
      return;  // Too short to be a swipe
    }

    if (absDeltaX > absDeltaY) {
      // Horizontal swipe
      if (deltaX > 0) {
        move(DIRECTIONS.RIGHT);
      } else {
        move(DIRECTIONS.LEFT);
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        move(DIRECTIONS.DOWN);
      } else {
        move(DIRECTIONS.UP);
      }
    }
  }
}

/**
 * Handle keyboard input
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
  if (game.isAnimating) return;

  const keyMap = {
    'ArrowUp': DIRECTIONS.UP,
    'ArrowDown': DIRECTIONS.DOWN,
    'ArrowLeft': DIRECTIONS.LEFT,
    'ArrowRight': DIRECTIONS.RIGHT
  };

  if (keyMap[event.key]) {
    event.preventDefault();
    move(keyMap[event.key]);
  }
}

// ==================== GAME LOGIC ====================

/**
 * Initialize a new game
 */
function initGame() {
  try {
    // Create empty grid
    game.grid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
      game.grid[i] = [];
      for (let j = 0; j < GRID_SIZE; j++) {
        game.grid[i][j] = 0;
      }
    }

    // Reset game state
    game.score = 0;
    game.hasWon = false;
    game.canContinue = true;
    game.moveHistory = [];

    // Add two initial tiles
    addRandomTile();
    addRandomTile();

    // Update displays
    updateDisplays();
    renderGrid();
    saveGameState();

    // Hide win/lose messages
    elements.winMessage.style.display = 'none';
    elements.loseMessage.style.display = 'none';
    if (elements.continueButton) {
      elements.continueButton.style.display = 'none';
    }
  } catch (error) {
    console.error('Error initializing game:', error);
    showError('Failed to start game. Please try again.');
  }
}

/**
 * Add a random tile (2 or 4) to an empty cell
 * @returns {boolean} True if tile was added, false if grid is full
 */
function addRandomTile() {
  const emptyCells = [];

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (game.grid[i][j] === 0) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }

  if (emptyCells.length === 0) {
    return false;
  }

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = Math.random() < TILE_SPAWN_PROBABILITY_2 ? 2 : 4;
  game.grid[row][col] = value;

  return true;
}

/**
 * Save current state to move history for undo functionality
 */
function saveToHistory() {
  const state = {
    grid: JSON.parse(JSON.stringify(game.grid)),
    score: game.score
  };
  game.moveHistory.push(state);

  // Limit history to last 10 moves
  if (game.moveHistory.length > 10) {
    game.moveHistory.shift();
  }

  updateUndoButton();
}

/**
 * Undo the last move
 */
function undoMove() {
  if (game.moveHistory.length === 0) return;

  const previousState = game.moveHistory.pop();
  game.grid = previousState.grid;
  game.score = previousState.score;

  renderGrid();
  updateDisplays();
  saveGameState();
  updateUndoButton();

  playSound('undo');
}

/**
 * Update undo button state
 */
function updateUndoButton() {
  if (elements.undoButton) {
    elements.undoButton.disabled = game.moveHistory.length === 0;
  }
}

/**
 * Main move function - handles tile movement in any direction
 * @param {string} direction - The direction to move (up, down, left, right)
 */
function move(direction) {
  if (game.isAnimating) return;

  saveToHistory();

  const oldGrid = JSON.parse(JSON.stringify(game.grid));
  let moved = false;

  switch (direction) {
    case DIRECTIONS.UP:
      moved = moveUp();
      break;
    case DIRECTIONS.DOWN:
      moved = moveDown();
      break;
    case DIRECTIONS.LEFT:
      moved = moveLeft();
      break;
    case DIRECTIONS.RIGHT:
      moved = moveRight();
      break;
  }

  // Only add new tile if something actually moved
  if (moved) {
    game.isAnimating = true;
    setTimeout(() => {
      addRandomTile();
      renderGrid();
      updateDisplays();
      checkGameStatus();
      saveGameState();
      game.isAnimating = false;
      playSound('move');
    }, ANIMATION_DURATION);
  } else {
    // No movement, remove from history
    game.moveHistory.pop();
  }

  renderGrid();
}

/**
 * Compress a line (remove zeros between tiles)
 * @param {number[]} line - Array of tile values
 * @returns {number[]} Compressed line
 */
function compress(line) {
  const newLine = line.filter(val => val !== 0);
  while (newLine.length < GRID_SIZE) {
    newLine.push(0);
  }
  return newLine;
}

/**
 * Merge adjacent tiles with the same value
 * @param {number[]} line - Array of tile values
 * @returns {Object} Object with merged line and points earned
 */
function merge(line) {
  let points = 0;
  for (let i = 0; i < GRID_SIZE - 1; i++) {
    if (line[i] !== 0 && line[i] === line[i + 1]) {
      line[i] *= 2;
      line[i + 1] = 0;
      points += line[i];

      // Update best tile
      if (line[i] > game.bestTile) {
        game.bestTile = line[i];
      }

      playSound('merge');
    }
  }
  return { line, points };
}

/**
 * Move tiles up
 * @returns {boolean} True if any tile moved
 */
function moveUp() {
  let moved = false;

  for (let col = 0; col < GRID_SIZE; col++) {
    let column = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      column.push(game.grid[row][col]);
    }

    const original = [...column];
    column = compress(column);
    const mergeResult = merge(column);
    column = compress(mergeResult.line);
    game.score += mergeResult.points;

    for (let row = 0; row < GRID_SIZE; row++) {
      if (game.grid[row][col] !== column[row]) {
        moved = true;
      }
      game.grid[row][col] = column[row];
    }
  }

  return moved;
}

/**
 * Move tiles down
 * @returns {boolean} True if any tile moved
 */
function moveDown() {
  let moved = false;

  for (let col = 0; col < GRID_SIZE; col++) {
    let column = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      column.push(game.grid[row][col]);
    }

    column.reverse();
    column = compress(column);
    const mergeResult = merge(column);
    column = compress(mergeResult.line);
    column.reverse();
    game.score += mergeResult.points;

    for (let row = 0; row < GRID_SIZE; row++) {
      if (game.grid[row][col] !== column[row]) {
        moved = true;
      }
      game.grid[row][col] = column[row];
    }
  }

  return moved;
}

/**
 * Move tiles left
 * @returns {boolean} True if any tile moved
 */
function moveLeft() {
  let moved = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    const original = [...game.grid[row]];
    let line = compress(game.grid[row]);
    const mergeResult = merge(line);
    line = compress(mergeResult.line);
    game.score += mergeResult.points;

    if (JSON.stringify(original) !== JSON.stringify(line)) {
      moved = true;
    }
    game.grid[row] = line;
  }

  return moved;
}

/**
 * Move tiles right
 * @returns {boolean} True if any tile moved
 */
function moveRight() {
  let moved = false;

  for (let row = 0; row < GRID_SIZE; row++) {
    const original = [...game.grid[row]];
    let line = [...game.grid[row]].reverse();
    line = compress(line);
    const mergeResult = merge(line);
    line = compress(mergeResult.line);
    line.reverse();
    game.score += mergeResult.points;

    if (JSON.stringify(original) !== JSON.stringify(line)) {
      moved = true;
    }
    game.grid[row] = line;
  }

  return moved;
}

/**
 * Check if the game is won or lost
 */
function checkGameStatus() {
  // Check for win (2048 tile)
  if (!game.hasWon) {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (game.grid[i][j] === WIN_TILE_VALUE) {
          game.hasWon = true;
          showWinMessage();
          playSound('win');
          return;
        }
      }
    }
  }

  // Check for loss (no moves possible)
  if (!canMove()) {
    showLoseMessage();
    playSound('lose');
  }
}

/**
 * Check if any moves are possible
 * @returns {boolean} True if moves are possible
 */
function canMove() {
  // Check for empty cells
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (game.grid[i][j] === 0) {
        return true;
      }
    }
  }

  // Check for possible merges
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const current = game.grid[i][j];
      if (i < GRID_SIZE - 1 && current === game.grid[i + 1][j]) {
        return true;
      }
      if (j < GRID_SIZE - 1 && current === game.grid[i][j + 1]) {
        return true;
      }
    }
  }

  return false;
}

// ==================== RENDERING ====================

/**
 * Render the grid to the DOM
 */
function renderGrid() {
  elements.gridContainer.innerHTML = '';

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const tileValue = game.grid[i][j];
      const tile = document.createElement('div');
      tile.classList.add('tile');

      if (tileValue > 0) {
        tile.textContent = tileValue;
        tile.classList.add(`tile-${tileValue}`);
        tile.setAttribute('data-value', tileValue);
      }

      // Add ARIA labels for accessibility
      tile.setAttribute('role', 'gridcell');
      tile.setAttribute('aria-label', tileValue > 0 ? `Tile value ${tileValue}` : 'Empty cell');

      elements.gridContainer.appendChild(tile);
    }
  }
}

/**
 * Update all display elements (score, high score, best tile)
 */
function updateDisplays() {
  elements.scoreDisplay.textContent = game.score;

  if (game.score > game.highScore) {
    game.highScore = game.score;
  }

  if (elements.highScoreDisplay) {
    elements.highScoreDisplay.textContent = game.highScore;
  }

  if (elements.bestTileDisplay) {
    elements.bestTileDisplay.textContent = game.bestTile;
  }
}

// ==================== UI INTERACTIONS ====================

/**
 * Toggle game instructions display
 */
function toggleInstructions() {
  const isVisible = elements.gameInstructions.style.display === 'block';
  elements.gameInstructions.style.display = isVisible ? 'none' : 'block';
  elements.backToWelcomeFromInstructions.style.display = isVisible ? 'none' : 'block';
}

/**
 * Start a new game
 * @param {Event} event - The click event
 */
function startGame(event) {
  event.preventDefault();
  elements.welcomeScreen.style.display = 'none';
  elements.gameBoard.style.display = 'block';
  elements.backToWelcomeFromGame.style.display = 'block';
  initGame();
}

/**
 * Restart the current game
 */
function restartGame() {
  elements.winMessage.style.display = 'none';
  elements.loseMessage.style.display = 'none';
  if (elements.continueButton) {
    elements.continueButton.style.display = 'none';
  }
  initGame();
  playSound('restart');
}

/**
 * Continue playing after reaching 2048
 */
function continueAfterWin() {
  elements.winMessage.style.display = 'none';
  if (elements.continueButton) {
    elements.continueButton.style.display = 'none';
  }
  game.canContinue = false;
}

/**
 * Return to welcome screen from instructions
 */
function backToWelcomeFromInstructions() {
  elements.gameInstructions.style.display = 'none';
  elements.welcomeScreen.style.display = 'block';
  elements.backToWelcomeFromInstructions.style.display = 'none';
  elements.backToWelcomeFromGame.style.display = 'none';
  elements.winMessage.style.display = 'none';
  elements.loseMessage.style.display = 'none';
}

/**
 * Return to welcome screen from game
 */
function backToWelcomeFromGame() {
  elements.gameBoard.style.display = 'none';
  elements.welcomeScreen.style.display = 'block';
  elements.backToWelcomeFromInstructions.style.display = 'none';
  elements.backToWelcomeFromGame.style.display = 'none';
  game.grid = [];
  game.score = 0;
  renderGrid();
}

/**
 * Show win message
 */
function showWinMessage() {
  elements.winMessage.style.display = 'block';
  if (elements.continueButton && game.canContinue) {
    elements.continueButton.style.display = 'block';
  }
}

/**
 * Show lose message
 */
function showLoseMessage() {
  elements.loseMessage.style.display = 'block';
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  alert(message);
}

// ==================== SOUND EFFECTS ====================

/**
 * Play sound effect
 * @param {string} soundType - Type of sound (move, merge, win, lose, etc.)
 */
function playSound(soundType) {
  if (!game.soundEnabled) return;

  // Sound effects would be implemented here with Web Audio API
  // For now, this is a placeholder
  console.log(`Playing sound: ${soundType}`);
}

// ==================== INITIALIZE ON LOAD ====================

// Initialize the game when the DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
