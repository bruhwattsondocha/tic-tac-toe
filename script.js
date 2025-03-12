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
  return { name, marker, isTheirTurn };
}

const gameController = (() => {
  let gameboard = createGameboard();
  const showGameboard = () => console.table(gameboard);
  const getRandom = () => {
    return Math.floor(Math.random() * 2);
  };
  let players = [];

  const getGameboard = () => {
    return gameboard.slice();
  }
  
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
  });

  const getTurn = (() => {
    const random = getRandom();
    players[0].isTheirTurn = !!random;
    players[1].isTheirTurn = !random;
  }); 

  const makeTurn = (player, row, col) => {
    gameboard[row - 1][col - 1] = player.marker;
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

  const getCurrentPlayer = () => {
    const currentPlayer = players[0].isTheirTurn === true ? players[0] : players[1];
    return currentPlayer;
  }
  const getOppositePlayer = () => {
    const oppositePlayer = players[0].isTheirTurn === false ? players[0] : players[1] 
    return oppositePlayer;
  }
  const getUserInput = (currentPlayer, oppositePlayer) => {
    const testRegex = /^[1-3], [1-3]$/;
    let rowAndCol;
    let row;
    let col;
    const getPosition = () => {
      rowAndCol = prompt(`${currentPlayer.name}, enter row and column from 1 to 3: "row, col" for '${currentPlayer.marker}'`);
      if (rowAndCol) [row, col] = [...rowAndCol.split(', ')];
    };

    while (true) {
      getPosition();

      if (!rowAndCol) {
        const cancelConfirm = confirm('You want to cancel the game?');
        if (cancelConfirm) {
          return `Cancel`;
        } continue;
      }

      if (!testRegex.test(rowAndCol)) { // Regex is not correct
        alert('Wrong input!');
        continue;
      } 

      if (gameboard[row - 1][col - 1] === oppositePlayer.marker) { // If there is opposite players marker in row col
        alert('There is enemies marker already!');
        continue;
      } 

      if (gameboard[row - 1][col - 1] === currentPlayer.marker) {// If there is your marker already in row col
        alert('There is your marker already!');
        continue;
      }

      break;
    }
    
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
      if (players[i].marker === winnersMarker) {
        return players[i];
      }
    }
  }

  const restartGame = () => {
    gameboard = createGameboard();
    players = [];
  }
  
  const playGame = () => {
    initPlayers();
    getTurn();
    for (let turns = 0; turns < 9; turns++) {
      const currentPlayer = getCurrentPlayer();
      const oppositePlayer = getOppositePlayer();
      displayController.showCurrentPlayer();
      const currentPlayerInput = getUserInput(currentPlayer, oppositePlayer);
      if (currentPlayerInput === `Cancel`) {
        restartGame();
        return `Game is cancelled`;
      }
      const [row, col] = [...currentPlayerInput];
      makeTurn(currentPlayer, row, col);
      showGameboard();
      displayController.refreshDisplay();
      const isGameOver = scanAndGetWinner();

      if (isGameOver) {
        restartGame();
        return `${isGameOver.name} wins!`;
      }
      if (turns === 8) {
        restartGame();
        return `Draw!`;
      }

      changeTurns();
    }
  }
  return { playGame, restartGame, getGameboard, getCurrentPlayer };
})();


const displayController = (() => {
  const getCells = () => {
    return document.querySelectorAll('.cell');
  }
  
  const getCellsArr = () => {
    const cells = getCells();
    const cellMatrix = {};
    cells.forEach(cell => {
      const cellValue = cell.getAttribute('value');

      switch(cellValue) {
        case '1': 
        case '2':
        case '3':
          cellMatrix[cellValue] = [0, cellValue - 1];
          break;
        case '4':
        case '5':
        case '6':
          cellMatrix[cellValue] = [1, cellValue - 4];
          break;
        case '7':
        case '8':
        case '9':
          cellMatrix[cellValue] = [2, cellValue - 7];
          break;
      }
    }) 
    return cellMatrix;
  }

  const clearDisplay = () => {
    const cells = getCells();
    cells.forEach(item => item.innerText = '');
  };

  const fillDisplay = () => {
    const cells = getCells();
    const cellsArr = getCellsArr();
    const iterableCellsArr = Object.entries(cellsArr);
    const gameboard = gameController.getGameboard();

    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells.length; j++) {
        if (cells[i].getAttribute('value') === iterableCellsArr[j][0]) {
          const [row, col] = [...iterableCellsArr[j][1]];
          if (gameboard[row][col] === '') break;
          cells[i].innerText = gameboard[row][col];
        }
      }
    }
  }
 
  const refreshDisplay = () => {
    clearDisplay();
    fillDisplay();
    showCurrentPlayer();
  }

  const showCurrentPlayer = () => {
    const currentPlayerNode = document.querySelector('.current-player');
    currentPlayerNode.style.display = 'block';
    currentPlayerNode.innerText = `Current player: ${gameController.getCurrentPlayer().name}`;
  };

  const updateStartButton = () => {
    const startButton = document.querySelector('.button');

    if (startButton.innerText === 'Start') {
      startButton.innerText = 'Restart';
    } else {
      startButton.innerText = 'Start';
    }
  }  
  return { fillDisplay, clearDisplay, refreshDisplay, showCurrentPlayer, updateStartButton };
})();

const clickHandler = (() => {
  const startGame = (() => {
    const startButton = document.querySelector('.button');
    if (startButton.innerText === 'Start') {
      startButton.addEventListener('click', gameController.playGame);
    }
  })();
  
})();