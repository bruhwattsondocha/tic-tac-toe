'use strict';

const createGameboard = () => {
  const gameboard = [];
  for (let i = 0; i < 3; i++) {
    gameboard.push([])
    for (let j = 0; j < 3; j++) {
      gameboard[i].push('');
    }
  }
  return gameboard;
};

const createPlayer = (name, marker) => {
  let isTheirTurn;
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker, isTheirTurn };
}

const gameController = () => {
  const gameboard = createGameboard();
  const showGameboard = console.log(gameboard);
  const getRandom = () => {
    return Math.floor(Math.random() * 2);
  }
  let players = [];

  const initPlayers = (() => {
    let playerOneName = prompt('Player one, enter your name') || 'Player One';
    let playerTwoName = prompt('Player two, enter your name') || 'Player Two';

    const random = getRandom();
    let playerOneMarker = random === 0 ? 'X' : 'O';
    let playerTwoMarker = playerOneMarker === 'X' ? 'O' : 'X';
    
    const playerOne = createPlayer(playerOneName, playerOneMarker);
    const playerTwo = createPlayer(playerTwoName, playerTwoMarker);
    players.push(playerOne);
    players.push(playerTwo);
  })();

  const getTurn = (() => {
    const random = getRandom();
    players[0].isTheirTurn = !!random;
    players[1].isTheirTurn = !random;
  })(); 

  const makeTurn = (player, row, col) => {
    if (!gameboard[row - 1][col - 1]) {
      gameboard[row - 1][col - 1] = player.getMarker();
    } else {
      return `Pick another cell!`;
    }
  };
  
  const changeTurns = () => {
    if (players[0].isTheirTurn === true) {
      players[0].isTheirTurn = false;
      players[1].isTheirTurn = true;
    } else if (players[1].isTheirTurn === true) {
      players[0].isTheirTurn = true;
      players[1].isTheirTurn = false;
    }
  }

  const getUserInput = () => {
    const testRegex = /[1-3], [1-3]/g;
    let rowAndCol;
    do {
      rowAndCol = prompt('Enter row and column: "row, col"');
    } while (!testRegex.test(rowAndCol));
    return rowAndCol.split(', ');
  }

  const scanAndGetWinner = () => {
    const rows = gameboard.length;
    const cols = gameboard[0].length;
    let winnersMarker; 
    const areSameMarkers = (arr) => {
      const set =  new Set(arr);
      if (set.has('')) return false;
      if (set.size === 1) return true;
    };

    // Check horizontal (rows)
    const row = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        row.push(gameboard[i][j]);
      }
      if (areSameMarkers(row)) {
        winnersMarker = row[0]; 
      }
      row.length = 0;
    }

    // Check vertical (cols)
    const col = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        col.push(gameboard[j][i]);
      }
      if (areSameMarkers(col)) {
        winnersMarker = col[0];
      }
      col.length = 0;
    }

    // Check diagonal 
    const diag = [];
    for (let i = 0; i < rows; i++) {
        diag.push(gameboard[i][i])
      }
    if (areSameMarkers(diag)) {
      winnersMarker = diag[0];
    }
    diag.length = 0;

    // Check anti-diagonal
    const antiDiag = [];
    for (let i = 0; i < rows; i++) {
        diag.push(gameboard[i][(rows - 1) - i]);
    }
    if (areSameMarkers(antiDiag)) {
      winnersMarker = antiDiag[0];
    }
    antiDiag.length = 0   

    // Loop through players and return winning player
    for (let i = 0; i < players.length; i++) {
      if (players[i].getMarker === winnersMarker) {
        return players[i];
      }
    }
  }
}