var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
let game = [];
io.on('connection', function (client) {
    client.emit('hello', 'World!');
    client.on('event', function (data) { });
    client.on('disconnect', function () { });
});
server.listen(3000);