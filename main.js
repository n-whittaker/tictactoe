// The gameBoard module handles the state of the game board.
const gameBoard = (function () {

    // Initialize the board with empty cells (0 represents an empty cell).
    let board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
    ];

    // Resets the board to its initial state.
    const resetBoard = function () {
        for (let i = 0; i < board.length; i++) {
            board[i] = 0;
        }
    }

    return {board, resetBoard};
})();

// The gameController module manages the game's logic and state.
const gameController = (function() {
    let activePlayer = 1; // Active player (1 or 2).
    let player1 = {}; // Player 1 object.
    let player2 = {}; // Player 2 object.
    let draws = 0; // Number of drawn games.

    // Starts a new game.
    const playGame = () => {
        displayController.showNameModal(); // Show name input modal.
        displayController.resetDisplay(); // Reset the display.
        activePlayer = 1; // Set active player to 1.
        playRound(); // Start a new round.

        setTimeout(() => {
            createPlayers();
        }, 100);
    }

    // Asks the players if they want to start a new game.
    const askNewGame = (winner) => {
        displayController.showPlayAgain(winner);
    }

    // Checks if any player has won the game (i.e., reached 3 points).
    const checkGameWin = () => {
        if (player1.score === 3) {
            displayController.displayMsg(`${player1.playerName} wins the game!`);
            setTimeout(() => {
                askNewGame(player1.playerName);
            }, 200);
        } else if (player2.score === 3) {
            displayController.displayMsg(`${player2.playerName} wins the game!`);
            setTimeout(() => {
                askNewGame(player2.playerName);
            }, 200);
        }
    }

    // Creates player objects from the given names.
    const createPlayers = function (plr1, plr2) {
        player1 = createPlayer(plr1);
        player2 = createPlayer(plr2);

        console.log(player1.playerName, player2.playerName);
        displayController.changeNames(player1.playerName, player2.playerName);
    }

    // Starts a new round of the game.
    const playRound = function () {
        displayController.showTurn(1); // Show turn for player 1.
        gameBoard.resetBoard(); // Reset the game board.
        displayController.updateDisplay(); // Update the display.
    }

    // Handles a player's turn.
    const takeTurn = function (playerTurn, location) {
        let input = location;

        if (!spaceAvailable(input)) {
            return;
        } else {
            gameBoard.board[input] = playerTurn;
            displayController.updateDisplay();

            let result = checkForResult();

            if (result !== undefined) {
                displayController.updateDisplay();
                setTimeout(() => {
                    takeScore(result);
                    announceWinner(result);
                    activePlayer = 1;
                    playRound();
                    checkGameWin();
                }, 100); // 100ms delay to ensure the mark is placed before announcing winner.
            } else {
                switchTurn();
            }
        }
    }

    // Switches the active player.
    const switchTurn = function () {
        activePlayer = (activePlayer === 1) ? 2 : 1;
        displayController.showTurn(activePlayer);
    }

    // Checks if a specific space on the board is available.
    const spaceAvailable = function (index) {
        return gameBoard.board[index] === 0;
    }

    // Returns the active player.
    const getActivePlayer = () => {
        return activePlayer;
    }

    // Checks for a winning combination or a draw.
    const checkForResult = function () {
        // Define winning combinations.
        const combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        // Helper function to check if all elements in an array are equal and non-zero.
        const allEqual = arr => arr.every(x => x === arr[0] && x !== 0);

        // Check for a winning combination.
        for (let comb of combinations) {
            let arr = comb.map(value => gameBoard.board[value]);
            if (allEqual(arr)) {
                return arr[0];  // Return the winner.
            }
        }

        // Check for a draw.
        const isFull = (x) => x > 0;
        if (gameBoard.board.every(isFull)) {
            return 0;
        }

        return undefined;
    }

    // Announces the winner of a round.
    const announceWinner = (winner) => {
        if (winner === 1) {
            displayController.displayMsg(`${player1.playerName} wins this round!`);
        } else if (winner === 2) {
            displayController.displayMsg(`${player2.playerName} wins this round!`);
        } else if (winner === 0) {
            displayController.displayMsg(`It's a draw!`);
        }
    }

    // Updates the score based on the round's result.
    const takeScore = function (winner) {
        if (winner === 1) {
            player1.score++;
        } else if (winner === 2) {
            player2.score++;
        } else {
            draws++;
        }

        displayController.updateScore(player1.score, player2.score, draws);
    }

    return {
        takeTurn, playRound, switchTurn, spaceAvailable, checkForResult, createPlayers, takeScore, getActivePlayer, playGame
    };
})();

// Factory function to create player objects.
function createPlayer (name) {
    const playerName = name;
    let score = 0;

    return {playerName, score};
}

// The displayController module manages the game's user interface.
const displayController = (function () {
    const p1 = document.querySelector(".pOneName");
    const p2 = document.querySelector(".pTwoName");
    const p1Score = document.querySelector(".p1Score");
    const p2Score = document.querySelector(".p2Score");
    const drawScore = document.querySelector(".drawScore");
    const modal = document.querySelector(".modal");
    const player1name = document.querySelector("#player-x-name-input");
    const player2name = document.querySelector("#player-o-name-input");
    const playAgainModal = document.querySelector(".playAgainModal");

    // Updates the display to reflect the current state of the game board.
    const updateDisplay = () => {
        const cells = document.querySelectorAll(".cell");

        cells.forEach((cell, index) => {
            cell.textContent = gameBoard.board[index] === 0 ? "" : (gameBoard.board[index] === 1 ? `X` : "O");
        });
    }

    // Adds event listeners to the UI elements.
    const addEventListeners = () => {
        const newGameBtn = document.querySelector(".newGameBtn");
        const buttons = document.querySelectorAll(".cell");
        const modalForm = document.querySelector(".modal-form");
        const playAgainYes = document.querySelector(".play-again-yes");
        const playAgainNo = document.querySelector(".play-again-no");

        buttons.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const indexChosen = event.target.id;
                gameController.takeTurn(gameController.getActivePlayer(), indexChosen);
            });
        });

        newGameBtn.addEventListener("click", () => {
            gameController.playGame();
            console.log("button clicked");

            buttons.forEach((btn) => {
                btn.disabled = false;
            });
        });

        modalForm.addEventListener("submit", (event) => {
            event.preventDefault();  // Prevent page reload on form submit.
            gameController.createPlayers(player1name.value, player2name.value);
            modal.style.display = "none";
        });

        playAgainYes.addEventListener("click", () => {
            playAgainModal.style.display = "none";
            resetDisplay();
            gameController.playGame();
        });

        playAgainNo.addEventListener("click", () => {
            playAgainModal.style.display = "none";
            resetDisplay();

            buttons.forEach((btn) => {
                btn.disabled = true;
            });
        });
    }

    // Shows whose turn it is by changing the color of player names.
    const showTurn = (activePlayer) => {
        if (activePlayer === 1) {
            p1.style.color = "#a4a4a4";
            p2.style.color = "#4f6367";
        } else {
            p1.style.color = "#4f6367";
            p2.style.color = "#a4a4a4";
        }
    }

    // Changes the display names of the players.
    const changeNames = (p1name, p2name) => {
        p1.textContent = p1name;
        p2.textContent = p2name;
    }

    // Updates the score display.
    const updateScore = (p1, p2, draws) => {
        p1Score.textContent = p1;
        p2Score.textContent = p2;
        drawScore.textContent = draws;
    }

    // Resets the display to the initial state.
    const resetDisplay = () => {
        p1.textContent = "";
        p2.textContent = "";
        p1Score.textContent = "0";
        p2Score.textContent = "0";
        drawScore.textContent = "0";
        displayMsg("First to 3 wins!");
    }

    // Displays a message to the user.
    const displayMsg = (message) => {
        const msgBox = document.querySelector(".messageBox");
        msgBox.textContent = message;
    }

    // Shows the name input modal.
    const showNameModal = () => {
        player1name.value = "";
        player2name.value = "";
        modal.style.display = "flex";
    }

    // Shows the play again modal.
    const showPlayAgain = (winner) => {
        const resultText = document.querySelector(".winner");
        resultText.textContent = winner;
        playAgainModal.style.display = "flex";
    }

    return {
        updateDisplay, addEventListeners, showTurn, changeNames, updateScore, resetDisplay, displayMsg, showNameModal, showPlayAgain
    };
})();

// Add event listeners to the display elements.
displayController.addEventListeners();
