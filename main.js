
const gameBoard = (function () {

    let board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0];

    const resetBoard = function () {

        // for loop accesses the right instance of board instead of create a new instance.
        for (let i = 0; i < board.length; i++) {
            board[i] = 0;
        }

    }

    return {board, resetBoard}
})();


const gameController = (function() {
    let activePlayer = 1;
    let player1 = {};
    let player2 = {};
    let draws = 0;

    const playGame = () => {
        displayController.resetDisplay();
        activePlayer = 1;
        playRound();

        setTimeout(() => {
            createPlayers();
        }, 100)

    }

    const askNewGame = () => {
        if (confirm(`Would you like to play again?`)) {
            playGame();
        } else {
            displayController.resetDisplay();
            displayController.updateDisplay();
        }
    }

    const checkGameWin = () => {
        if (player1.score === 3) {
            displayController.displayMsg(`${player1.playerName} wins the game!`);
            setTimeout(() => {
                askNewGame();
            }, 200)


        } else if (player2.score === 3){
            displayController.displayMsg(`${player2.playerName} wins the game!`);
            setTimeout(() => {
                askNewGame();
            }, 200)
        }
    }

    const createPlayers = function (plr1, plr2) {
        player1 = createPlayer(plr1);
        player2 = createPlayer(plr2);

        console.log(player1.playerName, player2.playerName);
        displayController.changeNames(player1.playerName, player2.playerName);
    }

    const playRound = function () {
        displayController.showTurn(1); // Initial show turn
        gameBoard.resetBoard();
        displayController.updateDisplay();

    }



    const takeTurn = function (playerTurn, location) {
        let input = location;

        if (!spaceAvailable(input)) {

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
                }, 100); // 100ms delay as announce winner alert was running before mark placed



            } else {
                switchTurn();
            }



        }

    }

    const switchTurn = function () {
        activePlayer =  (activePlayer === 1) ? 2 : 1;
        displayController.showTurn(activePlayer);
    }

    const spaceAvailable = function (index) {
        return gameBoard.board[index] === 0;
    }

    const getActivePlayer = () =>{
        return activePlayer
    }

    const checkForResult = function () {
        // Winning combinations
        const combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]

        // Function that takes an array, checks if every value in array is the same at the value at index[0], and
        // that it doesn't = 0.
        const allEqual = arr => arr.every(x => x === arr[0] && x !== 0);


        for (let comb of combinations) {
            let arr = comb.map(value => gameBoard.board[value]);
            if (allEqual(arr)) {
                return arr[0];  // return the winner
            }
        }

        // Checking for draw
        const isFull = (x) => x > 0;

        if (gameBoard.board.every(isFull)) {
            return 0;
        }

        return undefined;
    }


    const announceWinner = (winner) => {
        if (winner === 1) {
            displayController.displayMsg(`${player1.playerName} wins this round!`);

        } else if (winner === 2) {
            displayController.displayMsg(`${player2.playerName} wins this round!`);

        } else if (winner === 0){
            displayController.displayMsg(`It's a draw!`);
        }
    }

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



    return {takeTurn, playRound, switchTurn, spaceAvailable, checkForResult, createPlayers, takeScore, getActivePlayer,
        playGame}

})();


function createPlayer (name) {
    const playerName = name;
    let score = 0;

    return {playerName, score}
}
//

const displayController = (function () {
    const p1 = document.querySelector(".pOneName");
    const p2 = document.querySelector(".pTwoName");
    const p1Score = document.querySelector(".p1Score");
    const p2Score = document.querySelector(".p2Score");
    const drawScore = document.querySelector(".drawScore");
    const modal = document.querySelector(".modal");



    const updateDisplay = () => {
       const cells = document.querySelectorAll(".cell");

       cells.forEach((cell, index) => {
           cell.textContent = gameBoard.board[index] === 0 ? "" : (gameBoard.board[index] === 1 ? "X" : "O");
       })





    }


   const addEventListeners = () => {
        const startBtn = document.querySelector(".startBtn");
        const buttons = document.querySelectorAll(".cell");
        const modal = document.querySelector(".modal");
        const modalStart= document.querySelector(".modal-start");
        const modalForm = document.querySelector(".modal-form");

       buttons.forEach((btn) =>{
           btn.addEventListener("click", (event) => {
               const indexChosen = event.target.id;
               gameController.takeTurn(gameController.getActivePlayer(), indexChosen);
           })

       })

       startBtn.addEventListener("click", () => {
           gameController.playGame();
       })

       modalForm.addEventListener("submit", (event) => {
           event.preventDefault()  // SUbmitting form was reloading page by default
           const player1name = document.querySelector("#player-x-name-input");
           const player2name = document.querySelector("#player-o-name-input");



           gameController.createPlayers(player1name.value, player2name.value);

           modal.style.display = "none";


       })



    }

    const showTurn = (activePlayer) => {
        if (activePlayer === 1) {
            p1.style.color = "white";
            p2.style.color = "#4f6367";
        } else {
            p1.style.color = "#4f6367";
            p2.style.color = "white";
        }
    }

    const changeNames = (p1name, p2name) => {
        p1.textContent = p1name;
        p2.textContent = p2name;
    }

    const updateScore = (p1, p2, draws) => {
        p1Score.textContent = p1;
        p2Score.textContent = p2;
        drawScore.textContent = draws;
    }

    const resetDisplay = () => {
        p1.textContent = "";
        p2.textContent = "";
        p1Score.textContent = "0";
        p2Score.textContent = "0";
        drawScore.textContent = "0";
        displayMsg("First to 3 wins!")


    }

    const displayMsg = (message) => {
        const msgBox = document.querySelector(".messageBox");
        msgBox.textContent = message;
    }






   return {updateDisplay, addEventListeners, showTurn, changeNames, updateScore, resetDisplay, displayMsg}

})();

// gameController.playGame();
displayController.addEventListeners();



