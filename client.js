var io = require('socket.io-client');
var socket = io.connect('http://localhost:3000', { 'forceNew': true });
socket.on('connect', function(){});
socket.on('hello', console.log);
socket.on('disconnect', function(){});