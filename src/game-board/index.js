const Utilities = require('../helpers/utilities');
const { GAME_SIZE, GAME_STATE } = require('../helpers/constants');
const Screen = require('./screen');
const EventsKeyboard = require('./events-keyboard')(Screen, {
    onMarkPosition
});
const EventsSocket = require('./events-socket');
let mySocketConnection;

function onInit(config) {
    config.gameBoardData = Utilities.arrayToMatrix(config.gameBoardData, GAME_SIZE);
    Screen.setConfig(config);
    updateKeypressListenerStatus(config.currentTurn);
}

function onReciveMarkPosition({ gameBoardData, currentTurn }) {
    //console.log('onReciveMarkPosition', gameBoardData, currentTurn);
    updateKeypressListenerStatus(currentTurn);
    Screen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameBoardData, GAME_SIZE), currentTurn);
}

function onGameIsFull() {
    Screen.showErrorMessage('There is places in this match');
}

function onChangeGameState(gameState) {
    EventsKeyboard.pauseKeypressListener();
    if([GAME_STATE.FINISHED, GAME_STATE.TIED].indexOf(gameState.state) !== -1) {
        Screen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameState.gameBoardData, GAME_SIZE), gameState.currentTurn);
        if(gameState.state == GAME_STATE.FINISHED) {
            gameState.winningPlay = gameState.winningPlay.map((positionIndex) => {
                return Utilities.arrayIndexToMatrixIndex(positionIndex, GAME_SIZE);
            });
        }
        Screen.drawScreenWithState(gameState);
    }
}

function onGameReset({ gameBoardData, currentTurn }) {
    //console.log('onGameReset', gameBoardData, currentTurn);
    updateKeypressListenerStatus(currentTurn);
    Screen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameBoardData, GAME_SIZE), currentTurn);
}

function onWaitingPlayer(matchName) {
    Screen.showWarningMessage(`Waiting for a player to join on "${matchName}"...`);
}

function onMarkPosition() {
    const boardDataMatrix = Screen.getBoardDataMatrix();
    mySocketConnection.emitPositionMarked(Utilities.matrixToArray(boardDataMatrix));
    EventsKeyboard.pauseKeypressListener();
}

function updateKeypressListenerStatus(currentTurn) {
    if(Screen.getPlayerPlace() === currentTurn) {
        EventsKeyboard.resumeKeypressListener();
    } else {
        EventsKeyboard.pauseKeypressListener();
    }
}

function setConnection(socket) {
    mySocketConnection = EventsSocket(socket, {
        onInit,
        onReciveMarkPosition,
        onGameIsFull,
        onChangeGameState,
        onGameReset,
        onWaitingPlayer
    });
}

function startGame() {
    EventsKeyboard.initKeypressListener();
}

module.exports = {
    setConnection,
    startGame
};