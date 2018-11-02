var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
let game;
let gamerCount = 0;
let gamers = {
    1: null,
    2: null
};

function getGamerPlace() {
    return Object.keys(gamers).find(place => gamers[place] === null);
}

function resetGame() {
    game = ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '];
}

io.on('connection', function (client) {
    const gamerPlace = getGamerPlace();
    if(gamerPlace) {
        gamerCount++;
        gamers[gamerPlace] = gamerCount;
        client.gamerPlace = gamerPlace;
        console.log(`Current connections ${gamerCount}`);
        console.log(`New gamer connected, gamerPlace ${gamerPlace}`);
        client.emit('init', {
            boardData: game,
            unselectedPosition: '  ',
            number: gamerPlace
        });

        client.on('position marked', function (currentGame) {
            game = currentGame;
            console.log('MOVE:game', game);
            client.broadcast.emit('position marked', game);
            //server.emit('move', game);
        });

        client.on('disconnect', function () {
            console.log('client.gamerPlace', client.gamerPlace)
            gamerCount--;
            gamers[client.gamerPlace] = null;
            resetGame();
            server.emit('position marked', game);
        });
    } else {
        client.emit('game full');
    }
});
server.listen(3000);

resetGame();