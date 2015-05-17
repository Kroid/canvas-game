var chance = (new require('chance'))();
var Unit   = require('./unit');

function Player(socket) {
  var self = this;

  this.socket = socket;
  this.id     = socket.id;

  this.name  = chance.name();
  this.color = chance.color();
  
  this.units = [];

  var unit = new Unit(this);
  this.units.push(unit);


  socket.on('direction', function(direction) {
    self.units.map(function(unit) {
      unit.direction = direction;
    });
  })
}

Player.prototype.serialize = function() {
  return {
    id:    this.id,
    name:  this.name,
    color: this.color,
    units: this.units.map(function(u) { return u.serialize() })
  };
};

Player.prototype.removeUnit = function(index) {
  this.units.splice(index, 1);

  if (!this.units.length) {
    var unit = new Unit(this);
    this.units.push(unit);
  }
}


module.exports = Player;