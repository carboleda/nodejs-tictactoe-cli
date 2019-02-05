const Utilities = require('../helpers/utilities');
const { GAME_STATE } = require('../helpers/constants');
const GameBoardScreen = require('./game-board-screen');
const EventsKeyboard = require('./events-keyboard')(GameBoardScreen, {
    onMarkPosition
});
const EventsSocket = require('./events-socket');
let mySocketConnection;

function onInit(config) {
    config.gameBoardData = Utilities.arrayToMatrix(config.gameBoardData, config.gameSize);
    GameBoardScreen.setConfig(config);
    updateKeypressListenerStatus(config.currentTurn);
}

function onReciveMarkPosition({ gameBoardData, currentTurn }) {
    //console.log('onReciveMarkPosition', gameBoardData, currentTurn);
    updateKeypressListenerStatus(currentTurn);
    const gameSize = GameBoardScreen.getGameSize();
    GameBoardScreen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameBoardData, gameSize), currentTurn);
}

function onGameIsFull() {
    GameBoardScreen.showErrorMessage('There is places in this match');
}

function onChangeGameState(gameState) {
    const gameSize = GameBoardScreen.getGameSize();
    EventsKeyboard.pauseKeypressListener();
    if([GAME_STATE.FINISHED, GAME_STATE.TIED].indexOf(gameState.state) !== -1) {
        GameBoardScreen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameState.gameBoardData, gameSize), gameState.currentTurn);
        if(gameState.state == GAME_STATE.FINISHED) {
            gameState.winningPlay = gameState.winningPlay.map((positionIndex) => {
                return Utilities.arrayIndexToMatrixIndex(positionIndex, gameSize);
            });
        }
        GameBoardScreen.drawScreenWithState(gameState);
    }
}

function onGameReset({ gameBoardData, currentTurn }) {
    const gameSize = GameBoardScreen.getGameSize();
    //console.log('onGameReset', gameBoardData, currentTurn);
    updateKeypressListenerStatus(currentTurn);
    GameBoardScreen.updateBoardDataMatrix(Utilities.arrayToMatrix(gameBoardData, gameSize), currentTurn);
    GameBoardScreen.gameReset();
}

function onWaitingPlayer(matchName) {
    EventsKeyboard.pauseKeypressListener();
    GameBoardScreen.showWarningMessage(`Waiting for a player to join on "${matchName}"...`);
}

function onMarkPosition() {
    const boardDataMatrix = GameBoardScreen.getBoardDataMatrix();
    mySocketConnection.emitPositionMarked(Utilities.matrixToArray(boardDataMatrix));
    EventsKeyboard.pauseKeypressListener();
}

function updateKeypressListenerStatus(currentTurn) {
    if(GameBoardScreen.getPlayerPlace() === currentTurn) {
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