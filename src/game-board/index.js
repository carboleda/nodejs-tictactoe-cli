const Utilities = require('../helpers/utilities');
const { GAME_SIZE } = require('../helpers/constants');
const Screen = require('./screen');
const events = require('./events')(Screen, {
    onMarkPosition
});
const socketConnection = require('./socket-connection')({
    onInit,
    onReciveMarkPosition,
    onGameIsFull
});

function onInit(config) {
    config.boardData = Utilities.arrayToMatrix(config.boardData, GAME_SIZE);
    Screen.setConfig(config);
}

function onReciveMarkPosition(gameArray) {
    Screen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameArray, GAME_SIZE));
}

function onGameIsFull() {
    Screen.showMessage('No hay cupo en este juego');
}

function onMarkPosition() {
    const boardDataMatrix = Screen.getBoardDataMatrix();
    socketConnection.emitPositionMarked(Utilities.matrixToArray(boardDataMatrix));
}

function startGame() {
    events.initKeypressListener();
}

module.exports = {
    startGame
};