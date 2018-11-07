const Utilities = require('../helpers/utilities');
const { GAME_SIZE } = require('../helpers/constants');
const Screen = require('./screen');
const events = require('./events')(Screen, {
    onMarkPosition
});
const SocketConnection = require('./socket-connection');
let mySocketConnection;

function onInit(config) {
    config.boardData = Utilities.arrayToMatrix(config.boardData, GAME_SIZE);
    Screen.setConfig(config);
}

function onReciveMarkPosition(gameArray) {
    Screen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameArray, GAME_SIZE));
}

function onGameIsFull() {
    Screen.showMessage('There is places in this match');
}

function onWaitingPlayer() {
    Screen.showMessage('Waiting a player...');
}

function onMarkPosition() {
    const boardDataMatrix = Screen.getBoardDataMatrix();
    mySocketConnection.emitPositionMarked(Utilities.matrixToArray(boardDataMatrix));
}

function setConnection(socket) {
    mySocketConnection = SocketConnection(socket, {
        onInit,
        onReciveMarkPosition,
        onGameIsFull,
        onWaitingPlayer
    });
}

function startGame() {
    events.initKeypressListener();
}

module.exports = {
    setConnection,
    startGame
};