module.exports = function(socket, options) {
    socket.on('init', options.onInit);

    socket.on('position marked', options.onReciveMarkPosition);

    socket.on('game full', options.onGameIsFull);

    socket.on('waiting player', options.onWaitingPlayer);

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