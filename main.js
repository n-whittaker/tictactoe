const gameBoard = (function () {

    let board = [
        0, 0, 0,
        0, 0, 0,
        0, 0, 0];

    const resetBoard = function () {
        board = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0];
    }

    return {board, resetBoard}
})();


const gameController = (function() {
    let activePlayer = 1;
    let player1 = {};
    let player2 = {};

    const createPlayers = function () {
        player1 = createPlayer(prompt("Enter player 1 name: "));
        player2 = createPlayer(prompt("Enter player 2 name: "));
    }


    const takeTurn = function (playerTurn) {
        let input = prompt("Select location in array: ");
        while (!spaceAvailable(input)) {
            input = prompt("You cannot go there, select another location in array: ");
        }
        gameBoard.board[input] = playerTurn;
        console.log(gameBoard.board);
    }

    const switchTurn = function () {
        activePlayer =  (activePlayer === 1) ? 2 : 1;
        console.log(`It is now player ${activePlayer}'s turn`);
    }

    const spaceAvailable = function (index) {
        return gameBoard.board[index] === 0;
    }

    const playRound = function () {


        for (let i = 0; i < 9; i++) {
            takeTurn(activePlayer);

            const outcome = checkForResult();
            console.log(outcome)

            if (outcome === 1 || outcome === 2) {
                console.log(`${player1.playerName} wins!`)
                takeScore(outcome)
                break;
            } else if (outcome === 2) {
                console.log(`${player1.playerName} wins!`)
                takeScore(outcome)
                break;
            } else if (outcome === 0){
                console.log("it's a draw!")
                break;
            }

            switchTurn();
        }

        gameBoard.resetBoard();
    }

    const checkForResult = function () {
        // Winning combinations
        const combinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 4], [1, 4, 7], [2, 5, 8],
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
        }

        console.log(`${player1.playerName} score: ${player1.score}`)
        console.log(`${player2.playerName} score: ${player2.score}`)
    }

    return {takeTurn, playRound, switchTurn, spaceAvailable, checkForResult, createPlayers, takeScore}

})();


function createPlayer (name) {
    const playerName = name;
    let score = 0;

    return {playerName, score}
}

gameController.createPlayers();
gameController.playRound();


