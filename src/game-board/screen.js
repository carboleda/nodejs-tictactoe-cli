const colors = require('colors');
const config = require('../../config/config.json');
const Table = require('cli-table');
const { GAMER_CHAR } = require('../helpers/constants');
const Utilities = require('../helpers/utilities');
const Board = new Table(config.board);
let UNSELECTED_POSITION;
let GAMER;
let boardDataMatrix = [];
let cursor = {
    currentPosition: { x: 1, y: 1 },
    previousPosition: null,
    previousPositionValue: null
};

function setConfig(config) {
    if(!GAMER) {
        const { number, unselectedPosition, boardData } = config;
        GAMER = `GAMER${number}`;
        UNSELECTED_POSITION = `${unselectedPosition}`;
        boardDataMatrix = boardData;
        boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x] = `${GAMER_CHAR[`${GAMER}_CURSOR`]}`;
        drawScreen();
    }
}

function updateCursor(newCursor) {
    cursor = newCursor;
    //Se conserva el valor de la posición antes de calcular el cursor.currentPosition
    cursor.previousPositionValue = boardDataMatrix[cursor.previousPosition.y][cursor.previousPosition.x];
    const mMarkers = Utilities.getMarkers(GAMER_CHAR);
    const mCursors = Utilities.getCursors(GAMER_CHAR);

    //Si la casilla nueva no esta checkeada
    console.log('NEW', cursor.currentPosition, boardDataMatrix[cursor.currentPosition.y][cursor.currentPosition.x]);
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

function updateBoardDataMatrix(newBoardDataMatrix) {
    boardDataMatrix = newBoardDataMatrix;
    drawScreen();
}

function showMessage(msg) {
    clearScreen();
    console.log(msg.bold.red);
}

function getCursor() {
    return cursor;
}

function getBoardDataMatrix() {
    return boardDataMatrix;
}

//https://gist.github.com/KenanSulayman/4990953
function clearScreen() {
    return process.stdout.write('\033c');
}

function drawScreen() {
    clearScreen();
    // table is an Array, so you can `push`, `unshift`, `splice` and friends
    // Se eliminan todo el contenido del Board
    Board.splice(0);
    boardDataMatrix.forEach(row => {
        Board.push(row);
    });
    console.log('..::Tic Tac Toe::..'.bold.green);
    console.log('Gamer:'.bold, GAMER.bold.blue);
    const cursorChar = GAMER_CHAR[`${GAMER}_CURSOR`];
    const markChar = GAMER_CHAR[`${GAMER}_MARK`];
    console.log('Controlls:'.bold, 'Cursor:'.bold, `${cursorChar},`, 'Mark:'.bold, markChar);
    const { currentPosition } = cursor;
    console.log('Current position:'.bold, 'X:'.bold, `${currentPosition.x}`.bold.blue, 'Y:'.bold, `${currentPosition.y}`.bold.magenta);
    console.log('');
    console.log(Board.toString());
    console.log('');
    console.log('How use?'.bold);
    console.log('* Press up, down, left and right keys for move pointer');
    console.log('* Press enter for mark a position');
    console.log('* Press ctrl + c to exit');
}

module.exports = {
    setConfig,
    updateCursor,
    markPosition,
    updateBoardDataMatrix,
    showMessage,
    getCursor,
    getBoardDataMatrix,
    clearScreen,
    drawScreen,
};