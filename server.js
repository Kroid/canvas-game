var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

require('./app/app')(io);

app.use(express.static('public'));


server.listen(3000, function() {
  console.log('listening on *:3000');
});