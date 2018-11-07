const io = require('socket.io-client');
const config = require('./config/config.json');
const socket = io.connect(config.server);
const GameBoard = require('./src/game-board');
const GameSetup = require('./src/game-setup')(socket, {
    onFinish: GameBoard.startGame
});

GameBoard.setConnection(socket);
GameSetup.init();