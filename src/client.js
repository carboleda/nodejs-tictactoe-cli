const Utilities = require('./helpers/utilities');
const { GAME_SIZE } = require('./helpers/constants');
const Screen = require('./game-board/screen');
const events = require('./game-board/events')(Screen, {
    onMarkPosition
});
const socketConnection = require('./game-board/socket-connection')({
    onInit,
    onReciveMarkPosition,
    onGameIsFull
});

events.initKeypressListener();

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