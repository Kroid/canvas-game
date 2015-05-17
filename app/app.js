var Game = require('./game');


module.exports = function(io) {
  var game = new Game(io);
  game.start();

  io.on('connection', function(socket){
    game.addPlayer(socket);
});
}


