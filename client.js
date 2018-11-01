const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
const util = require('./util');
const viewer = require('./index');

socket.on('move', function(gameArray) {
    viewer.updateDataTable(util.arrayToMatrix(gameArray, 3));
    //console.log('gameArray', gameArray);
});

socket.on('init', function(config) {
    //console.log(config);
    config.game = util.arrayToMatrix(config.game, 3);
    viewer.setConfig(config);
});

socket.on('game full', function() {
    viewer.showMessage('No hay cupo en este juego');
});

socket.on('disconnect', function() {

});

function sendMove(gameMatrix) {
    //console.log('gameMatrix', gameMatrix);
    socket.emit('move', util.matrixToArray(gameMatrix));
}

module.exports = {
    sendMove: sendMove
}