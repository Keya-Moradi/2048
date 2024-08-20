# 2048

A sliding puzzle game where the player moves numbered tiles on a grid to combine them and create a tile with the number 2048. The game is lost if no more moves are possible.

## Keya's 2048 Game

![Welcome Screen](https://raw.githubusercontent.com/keya-moradi/2048/main/.vscode/images/welcome.png)

## Background Information

2048 is an exciting math game, and I chose it because it's one of my favorite games. 2048 is a single-player sliding tile puzzle video game written by Italian web developer Gabriele Cirulli and published on [GitHub](https://github.com/gabrielecirulli/2048).

## Getting Started

### Link to Deployed Game

[Link to Keya's 2048 Game](https://keya-moradi.github.io/2048/)

### How to Play

1. **Objective:** Reach the 2048 tile by merging tiles of the same number.
2. **Controls:** Use the arrow keys (up, down, left, right) to move tiles.
3. **Merging Tiles:** Tiles with the same number merge into one when they touch. The resulting tile’s value is the sum of the merged tiles.
4. **Game End:** You win by reaching the 2048 tile. The game ends if there are no possible moves left.

### Instructions

- Click "Let's Play!" to start the game.
- Use the arrow keys to move the tiles and merge them.
- Your current score is displayed at the bottom of the game board.
- Click "Restart" to start a new game.

### Attributions

- [Original 2048 Game by Gabriele Cirulli](https://github.com/gabrielecirulli/2048)
- [Game Design Inspiration Video](https://www.youtube.com/watch?v=wOVEe9eawXc)
- [Chat GPT](https://chatgpt.com/)
- [Gemini](https://gemini.google.com/app)

### Technologies Used

- HTML
- CSS
- JavaScript
- GitHub Pages
- Visual Studio Code
- GitHub
- CSS Flexbox for board layout
- CSS Grid for game board layout design
- Colors appropriate contrast that meet the WCAG 2.0 level AA standard

### User Stories

As a user, I want to:

- **See a welcome screen on the website** with two options:
  - The first link [titled “Game Instructions”] takes the user to a page with instructions on how to play the game, with some screenshots of the actual game.
  - The second link takes the user to the game [titled “Let's play!”].

- **See a 4x4 grid on the screen** to play the game with vibrant colors.
  - Two tiles at random spots start with the number “2” or “4” displayed on them.
  - When the game begins, a new tile will appear and fall on one of the existing tiles, allowing the user to start engaging with them and attempt to merge them.
  - A new tile will fall from the ceiling of the grid every time there is a successful merge.
  - The user will see the currently selected tile shaded in grey with reasonable opacity so as not to overshadow the displayed value of the tile.

- **Click to select a tile**, and then use the arrow keys [up, down, left, right] to merge it in the direction of an adjacent tile with a matching number to achieve a higher score.
  - If the number doesn’t match the direction the user selects, the tile trying to merge will shake left and right to signal to the user that the move is not possible.
  - If the tile is eligible to merge, the tiles will double their displayed value and merge into one.
  - If there are tiles beneath where they are merging, the tile will simply display the new value.
  - If there are no tiles beneath where they merge, the new combined tile will fall until it hits the floor or lands on top of an existing tile.

- **See my current score** at the top of the game to track my progress. [titled: “Current Score”]

- **See a message when I win** by reaching the 2048 tile to know I have completed the game. [titled: “You Win!”]

- **See a message when I lose** to understand when the game ends and can restart. [titled “Game Over!”].

- Have a **button to restart the game** so I can play again without refreshing the page. [titled “Restart”]

- Have a **button that takes me back to the welcome screen**.

### Pseudocode

#### Define constants and variables

- Define constants for the grid size and initial tile values.
- Define variables for the game state, including the grid, score, and game status (win/lose).
- Define variables for valid/invalid merges and selected tiles.

#### Initialize the game

- **Function `init()`:**
  - Create a 4x4 grid initialized with zeros.
  - Add two initial tiles with values of 2 or 4 at random positions.
  - Set the score to zero.
  - Set the game status to active.
  - Render the initial grid and score to the DOM.

#### Render the game state

- **Function `render()`:**
  - Loop through the grid and update the DOM with current tile values.
  - Display the current score.
  - Display win/lose messages if applicable.

#### Handle user input

- Add event listeners for arrow keys:
  - **Function `handleMove(direction)`:**
    - Determine which current tile the mouse click is selecting.
    - Determine the direction of movement (up, down, left, right).
    - Slide tiles in the specified direction.
    - Combine tiles with the same value.
    - Shake the selected tile left and right if the merge is invalid and unsuccessful.
    - Add a new tile with a value of 2 or 4 at a random empty position.
    - Update the score.
    - Check for win/lose conditions.

#### Check win/lose conditions

- **Function `checkWinLose()`:**
  - Check if a tile with a value of 2048 is present for a win.
  - Check if no moves are possible for a loss.
  - Update the game status accordingly.

#### Restart the game

- Add an event listener to the "Restart" button:
  - **Function `restartGame()`:**
    - Reset the game state to the initial conditions.
    - Re-render the game.

### Next Steps

Planned future enhancements:

- **Improved UX/UI:** Enhance the game interface for a better user experience.
- **Improved Logic:**
  - Allow merging of multiple tiles in a row.
  - Prevent tiles from merging more than once in the same move.

---
