'use strict';

const createGameboard = (() => {
  const gameboard = [];
  for (let i = 0; i < 3; i++) {
    gameboard.push([])
    for (let j = 0; j < 3; j++) {
      gameboard[i].push('');
    }
  }
  return gameboard;
})();

const createPlayer = (name, marker) => {
  let isTheirTurn;
  const getName = () => name;
  const getMarker = () => marker;
  return { getName, getMarker, isTheirTurn };
}

