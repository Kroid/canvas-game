var config = require('./config');

function Unit(player, position, options) {
  options = options || {};

  this.player   = player;
  this.position = position ||  {
    x: Math.floor(Math.random() * config.field.width),
    y: Math.floor(Math.random() * config.field.height)
  };
  this.size     = options.size || config.unit.size;
  this.force    = config.unit.force;

  this.direction = null
}

Unit.prototype.move = function(dTime) {
  if (this.direction === null) {
    return;
  }

  var distance = this.speed() * (dTime/1000);
  
  this.position = {
    x: this.position.x + Math.cos(this.direction) * distance,
    y: this.position.y + Math.sin(this.direction) * distance
  };

  if (this.position.x < 0) { this.position.x = 0 }
  if (this.position.x > config.field.width) { this.position.x = config.field.width }
  if (this.position.y < 0) { this.position.y = 0 }
  if (this.position.y > config.field.height) { this.position.y = config.field.height }
};

Unit.prototype.radius = function() {
  return Math.sqrt(this.size * 10 / Math.PI);
};

Unit.prototype.speed = function() {
  return this.force / this.size;
};

Unit.prototype.serialize = function() {
  return {
    position: this.position,
    radius: this.radius()
  };
}



module.exports = Unit;