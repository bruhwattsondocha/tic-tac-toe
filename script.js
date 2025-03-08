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
  const gameBoard = createGameboard();
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
}