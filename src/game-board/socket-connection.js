module.exports = function(options) {
    const Utilities = require('../helpers/utilities');
    const io = require('socket.io-client');
    const config = require('../../config/config.json');
    const socket = io.connect(config.server);

    socket.on('init', options.onInit);

    socket.on('position marked', options.onReciveMarkPosition);

    socket.on('game full', options.onGameIsFull);

    socket.on('disconnect', function() {

    });

    function emitPositionMarked(boardDataArray) {
        //console.log('gameMatrix', gameMatrix);
        socket.emit('position marked', boardDataArray);
    }

    return {
        emitPositionMarked: emitPositionMarked
    }
}