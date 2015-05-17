'use strict';

var socket = io();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;

var position = null;


socket.on('update', function(state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  state.players.map(function(player) {

    player.units.map(function(unit) {
      if (player.id === socket.id) {
        position = unit.position;
      }

      var unit = new Unit({
        position: unit.position,
        radius: unit.radius,
        color: player.color
      });

      unit.render(ctx);
    });
  })

  state.foods.map(function(food) {
    var f = new Food(food);
    f.render(ctx);
  })
});

socket.on('init', function(data) {
  ctx.canvas.addEventListener('mousemove', function(e) {
    var mousePosition = getMousePosition(ctx.canvas, e);
    var direction = calculateRadians(position, mousePosition);
    socket.emit('direction', direction);
  });
});








function Food(position) {
  this.position = position;
}

Food.prototype.render = function(context) {
  var numberOfSides = 6;
  var size = 5;

  context.beginPath();
  context.moveTo (this.position.x +  size * Math.cos(0), this.position.y +  size *  Math.sin(0));

  for (var i=0; i < numberOfSides+1; i++) {
    context.lineTo (this.position.x + size * Math.cos(i * 2 * Math.PI / numberOfSides), this.position.y + size * Math.sin(i * 2 * Math.PI / numberOfSides));
  }

  context.fillStyle = "red";
  context.fill();
}

function Unit(options) {
  this.position = options.position;
  this.radius = options.radius;
  this.color = options.color;
}

Unit.prototype.render = function(context) {
  context.beginPath();
  context.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI);
  context.fillStyle = this.color;
  context.fill();
}



function getMousePosition(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}

function calculateRadians(p1, p2) {
  var dx = p2.x - p1.x;
  var dy = p2.y - p1.y;
  return Math.atan2(dy, dx);
}
