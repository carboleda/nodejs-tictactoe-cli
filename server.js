var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
let game;
let gamerCount = 0;
let gamers = {
    1: null,
    2: null
};
io.on('connection', function (client) {
    const gamerPlace = getGamerPlace();
    if(gamerPlace) {
        gamerCount++;
        gamers[gamerPlace] = gamerCount;
        client.gamerPlace = gamerPlace;
        console.log(`Current connections ${gamerCount}`);
        console.log(`New gamer connected, gamerPlace ${gamerPlace}`);
        client.emit('init', {
            game,
            unselect_pos: '  ',
            num: gamerPlace
        });

        client.on('move', function (currentGame) {
            game = currentGame;
            console.log('MOVE:game', game);
            client.broadcast.emit('move', game);
            //server.emit('move', game);
        });

        client.on('disconnect', function () {
            console.log('client.gamerPlace', client.gamerPlace)
            gamerCount--;
            gamers[client.gamerPlace] = null;
            resetGame();
            server.emit('move', game);
        });
    } else {
        client.emit('game full');
    }
});
server.listen(3000);

function getGamerPlace() {
    if(!gamers['1']) {
        return '1';
    } else if(!gamers['2']) {
        return '2';
    }

    return null;
}

function resetGame() {
    game = ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '];
}

resetGame();