module.exports = function(socket, options) {
    socket.on('init', options.onInit);

    socket.on('position marked', options.onReciveMarkPosition);

    socket.on('game full', options.onGameIsFull);

    socket.on('game state', options.onChangeGameState);

    socket.on('game reset', options.onGameReset);

    socket.on('waiting player', options.onWaitingPlayer);

    socket.on('disconnect', function() {

    });

    function emitPositionMarked(boardDataArray) {
        socket.emit('position marked', boardDataArray);
    }

    return {
        emitPositionMarked: emitPositionMarked
    }
}