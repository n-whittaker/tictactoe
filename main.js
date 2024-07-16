
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

        console.log("Board reset:", board);  // Add logging to verify board reset

    }

    return {board, resetBoard}
})();


const gameController = (function() {
    let activePlayer = 1;
    let player1 = {};
    let player2 = {};
    let draws = 0;

    const getActivePlayer = () =>{
        return activePlayer
    }
    const createPlayers = function () {
        player1 = createPlayer(prompt("Enter player X name: "));
        player2 = createPlayer(prompt("Enter player O name: "));

        displayController.changeNames(player1.playerName, player2.playerName);

    }

    const takeTurn = function (playerTurn, location) {

        let input = location;

        if (!spaceAvailable(input)) {
            alert("You cannot go there, try again");
        } else {
            gameBoard.board[input] = playerTurn;
            displayController.updateDisplay();

            let result = checkForResult();

            if (result !== undefined) {
                announceWinner(result);
                takeScore(result);
                gameBoard.resetBoard();
                displayController.updateDisplay();  // Ensure this is called after resetBoard
                activePlayer = 1;
            }


            switchTurn();
        }

    }


    const announceWinner = (winner) => {
        if (winner === 1) {
            console.log(`${player1.playerName} wins!`)
            // i need to retrun somethingn here
        } else if (winner === 2) {
            console.log(`${player2.playerName} wins!`)

        } else if (winner === 0){
            console.log("it's a draw!");
        }
    }

    const switchTurn = function () {
        activePlayer =  (activePlayer === 1) ? 2 : 1;
        displayController.showTurn(activePlayer);
    }

    const spaceAvailable = function (index) {
        return gameBoard.board[index] === 0;
    }

    const playGame = () => {
        createPlayers();
        displayController.showTurn(activePlayer); // Initial show turn
        playRound();
    }

    const playRound = function () {
        displayController.addEventListeners();
        gameBoard.resetBoard();
        displayController.updateDisplay();



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


    const updateDisplay = () => {
       const cells = document.querySelectorAll(".cell");

       cells.forEach((cell, index) => {
           cell.textContent = gameBoard.board[index] === 0 ? "" : (gameBoard.board[index] === 1 ? "X" : "O");
       })





    }


   const addEventListeners = () => {
       const buttons = document.querySelectorAll(".cell");

       buttons.forEach((btn) =>{
           btn.addEventListener("click", (event) => {
               const indexChosen = event.target.id;
               gameController.takeTurn(gameController.getActivePlayer(), indexChosen);
           })

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
        const p1Score = document.querySelector(".p1Score");
        const p2Score = document.querySelector(".p2Score");
        const drawScore = document.querySelector(".drawScore");

        p1Score.textContent = p1;
        p2Score.textContent = p2;
        drawScore.textContent = draws;
    }



   return {updateDisplay, addEventListeners, showTurn, changeNames, updateScore}

})();

gameController.playGame();




