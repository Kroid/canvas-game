var _       = require('underscore');
var Player  = require('./player');
var config  = require('./config');
var helpers = require('./helpers');

function Game(io) {
  this.io    = io;
  this.field = config.field;
  
  this.players = [];
  this.foods   = [];
}

Game.prototype.addPlayer = function(socket) {
  var self = this;

  var player = new Player(socket);
  this.players.push(player);

  socket.on('disconnect', function(){
    self.removePlayer(player.id);
  });

  socket.emit('init', {
    id: player.id,
    units: player.units.map(function(unit) {
      return {
        position: unit.position,
        radius: unit.radius
      }
    })
  });
};

Game.prototype.removePlayer = function(id) {
  this.players = _.reject(this.players, function(p) {
    return id === p.id;
  });
};

Game.prototype.start = function() {
  var interval = 1000/config.fps;
  var now      = Date.now();
  
  this.loop(interval, now);
  this.generateFood(100);
};

Game.prototype.loop = function(interval, then) {
  var self = this;

  var now   = Date.now();
  var delta = now - then;

  setTimeout(function() {
    self.loop(interval, now - delta % interval);
  }, 10);

  if (delta < interval) {
    return;
  }

  this.calculation(delta);
};

Game.prototype.calculation = function(dTime) {
  var self = this;

  // move units && eat foods
  _.each(this.players, function(player) {
    _.each(player.units, function(unit) {
      unit.move(dTime);

      // eat foods
      var partials = _.partition(self.foods, function(position) {
        return helpers.isCollision(unit.position, unit.radius(), position);
      });

      unit.size += partials[0].length * config.food.size;
      self.foods = partials[1];

      // eat other units
      for(var i in self.players) {
        for(var j in self.players[i].units) {
          var enemy = self.players[i].units[j];
          if (helpers.isCollision(unit.position, unit.radius(), enemy.position)) {
            if (unit.size > enemy.size) {
              self.players[i].removeUnit(j);
            }
          }
        }
      }

    });
  });

  this.sendUpdatedState();
};

Game.prototype.sendUpdatedState = function() {
  var state = {
    players: this.players.map(function(p) { return p.serialize(); }),
    foods: this.foods
  };

  this.io.emit('update', state);
};

Game.prototype.generateFood = function(interval) {
  var self = this;
  
  if (this.foods.length > 100) {
    setTimeout(function() {
      self.generateFood(interval);
    }, interval);
    return;
  }


  var position = {
    x: Math.floor(Math.random()*this.field.width),
    y: Math.floor(Math.random()*this.field.height)
  }

  for (var i in this.players) {
    for (var j in this.players[i].units) {
      var unit = this.players[i].units[j];
      if (helpers.isCollision(unit.position, unit.radius(), position)) {
        return this.generateFood();
      }
    }
  }

  this.foods.push(position);

  setTimeout(function() {
    self.generateFood(interval);
  }, interval);
};

module.exports = Game;