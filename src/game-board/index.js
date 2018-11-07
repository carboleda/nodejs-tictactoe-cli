const Utilities = require('../helpers/utilities');
const { GAME_SIZE } = require('../helpers/constants');
const Screen = require('./screen');
const events = require('./events')(Screen, {
    onMarkPosition
});
const SocketConnection = require('./socket-connection');
let mySocketConnection;

function onInit(config) {
    config.gameBoardData = Utilities.arrayToMatrix(config.gameBoardData, GAME_SIZE);
    Screen.setConfig(config);
    updateKeypressListenerStatus(config.currentTurn);
}

function onReciveMarkPosition({ gameBoardData, currentTurn }) {
    console.log('onReciveMarkPosition', gameBoardData, currentTurn);
    updateKeypressListenerStatus(currentTurn);
    Screen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameBoardData, GAME_SIZE), currentTurn);
}

function onGameIsFull() {
    Screen.showMessage('There is places in this match');
}

function onWaitingPlayer(matchName) {
    Screen.showMessage(`Waiting for a player to join on "${matchName}"...`);
}

function onMarkPosition() {
    const boardDataMatrix = Screen.getBoardDataMatrix();
    mySocketConnection.emitPositionMarked(Utilities.matrixToArray(boardDataMatrix));
    events.pauseKeypressListener();
}

function updateKeypressListenerStatus(currentTurn) {
    if(Screen.getPlayerPlace() === currentTurn) {
        events.resumeKeypressListener();
    } else {
        events.pauseKeypressListener();
    }
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