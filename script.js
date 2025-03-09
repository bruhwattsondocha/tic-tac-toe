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
    let playerOneName = prompt('Enter your name') || 'Player One';
    let playerTwoName = prompt('Enter your name') || 'Player Two';

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
    if (row < 1 || row > 3) return `Impossible row`;
    if (col < 1 || col > 3) return `Impossible column`;

    if (!gameboard[row - 1][col - 1]) {
      gameboard[row - 1][col - 1] = player.getMarker();
    } else {
      return `Pick another cell!`;
    }
  };
 } 