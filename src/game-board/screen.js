const colors = require('colors');
const config = require('../../config/config.json');
const Table = require('cli-table');
const { GAMER_CHAR, GAME_STATE } = require('../helpers/constants');
const Utilities = require('../helpers/utilities');
const Board = new Table(config.board);
let UNSELECTED_POSITION;
let GAMER;
let nickName;
let playerPlace;
let currentTurn;
let boardDataMatrix = [];
let currentGameState = {
    state: GAME_STATE.IN_PROGRESS
};
let cursor = {
    currentPosition: { x: 1, y: 1 },
    previousPosition: null,
    previousPositionValue: null
};

function setConfig(config) {
    nickName = config.nickName;
    playerPlace = config.playerPlace;
    currentTurn = config.currentTurn;
    const { unselectedPosition, gameBoardData } = config;
    GAMER = `GAMER${playerPlace}`;
    UNSELECTED_POSITION = `${unselectedPosition}`;
    boardDataMatrix = gameBoardData;
    boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x] = `${GAMER_CHAR[`${GAMER}_CURSOR`]}`;
    drawScreen();
}

function updateCursor(newCursor) {
    cursor = newCursor;
    //Se conserva el valor de la posición antes de calcular el cursor.currentPosition
    cursor.previousPositionValue = boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x];
    const mMarkers = Utilities.getMarkers(GAMER_CHAR);
    const mCursors = Utilities.getCursors(GAMER_CHAR);

    //Si la casilla nueva no esta checkeada
    //console.log('NEW', cursor.currentPosition, boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]);
    if(mMarkers.indexOf(boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]) === -1) {
        //Asignar el cursor a la posicion actual
        boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x] = GAMER_CHAR[`${GAMER}_CURSOR`];
    } else if(mCursors.indexOf(boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]) !== -1) {
        boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]
            = boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x];
    } else if(mMarkers.indexOf(boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]) !== -1) {
        boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]
            = boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x].bold.yellow;
    }

    if(cursor.previousPosition) {
        //console.log('CURRENT', cursor.previousPosition, boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x]);
        if(mCursors.indexOf(boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x]) !== -1) {
            boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x] = UNSELECTED_POSITION;
        } else if(mMarkers.indexOf(boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x]) != -1) {
            //console.log('SALIO DE UN POSICION CHECKEADA', boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x]);
            boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x] = Utilities.stripColors(cursor.previousPositionValue);
        } else {
            boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x] = cursor.previousPositionValue;
        }
    }
}

function markPosition() {
    boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x] = GAMER_CHAR[`${GAMER}_MARK`];
    drawScreen();
}

function updateBoardDataMatrix(newBoardDataMatrix, newCurrentTurn) {
    if(newBoardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x] === UNSELECTED_POSITION) {
        newBoardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x] = `${GAMER_CHAR[`${GAMER}_CURSOR`]}`;
    } else {
        newBoardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]
            = newBoardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x].bold.yellow;
    }
    boardDataMatrix = newBoardDataMatrix;
    currentTurn = newCurrentTurn;
    drawScreen();
}

function showSuccessMessage(msg) {
    Utilities.clearScreen();
    console.log(msg.bold.green);
}

function showWarningMessage(msg) {
    Utilities.clearScreen();
    console.log(msg.bold.yellow);
}

function showErrorMessage(msg) {
    Utilities.clearScreen();
    console.log(msg.bold.red);
}

function getCursor() {
    return cursor;
}

function getPlayerPlace() {
    return playerPlace;
}

function getBoardDataMatrix() {
    return boardDataMatrix;
}

function drawHeader() {
    console.log('..::Tic Tac Toe::..'.bold.green);
    console.log('Gamer Nick:'.bold, nickName.bold.blue);
    const cursorChar = GAMER_CHAR[`${GAMER}_CURSOR`];
    const markChar = GAMER_CHAR[`${GAMER}_MARK`];
    console.log('Controlls:'.bold, 'Cursor:'.bold, `${cursorChar},`, 'Mark:'.bold, markChar);
}

function drawFooter() {
    console.log('How to use it?'.bold);
    console.log('* Press up, down, left and right keys for move cursor');
    console.log('* Press enter for mark a position');
    console.log('* Press ctrl + c to exit');
}

function drawCurrentPosition() {
    const { currentPosition } = cursor;
    console.log('Current position:'.bold,
        'X:'.bold, `${currentPosition.x}`.bold.blue,
        'Y:'.bold, `${currentPosition.y}`.bold.magenta);
    console.log(currentTurn === playerPlace
        ? "IT'S YOUR TURN... 🤔 ".bold.green
        : "WAITING FOR THE PLAY... 👀 ".bold.red);
}

function drawGameBorad() {
    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    // Se eliminan todo el contenido del Board
    Board.splice(0);
    boardDataMatrix.forEach(row => {
        Board.push(row);
    });
    console.log('');
    console.log(Board.toString());
    console.log('');
}

function drawScreen() {
    if(currentGameState.state === GAME_STATE.IN_PROGRESS) {
        Utilities.clearScreen();
        drawHeader();
        drawCurrentPosition();
        drawGameBorad();
        drawFooter();
    } else {
        drawScreenWithState();
    }
}

function drawScreenWithState(gameState = currentGameState) {
    Utilities.clearScreen();
    drawHeader();
    console.log('');
    if(gameState.state === GAME_STATE.FINISHED) {
        if(gameState.winnerPlace === playerPlace) {
            console.log("YOU ARE WINNER!!! 🏆 🎊 🎉 ".bold.green);
        } else {
            console.log("YOU LOSS!!! 😭 🤕 ☠️ ".bold.red);
        }
        gameState.winningPlay.forEach((position) => {
            boardDataMatrix[position.y][position.x]
                = Utilities.stripColors(boardDataMatrix[position.y][position.x]).bold.magenta;
        });
    } else if(gameState.state === GAME_STATE.TIED) {
        console.log("THE GAME IS TIED 😩 ".bold.yellow);
    }
    currentGameState = gameState;
    drawGameBorad();
    drawFooter();
}

module.exports = {
    setConfig,
    updateCursor,
    markPosition,
    updateBoardDataMatrix,
    showSuccessMessage,
    showWarningMessage,
    showErrorMessage,
    getCursor,
    getPlayerPlace,
    getBoardDataMatrix,
    clearScreen: Utilities.clearScreen,
    drawScreen,
    drawScreenWithState,
};