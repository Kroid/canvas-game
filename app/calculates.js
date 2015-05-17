var DEFAULT_UNIT_FORCE = 1000;

function calculateRadius(size) {
  return Math.sqrt(size * 10 / Math.PI);
}

function calculateSpeed(size) {
  return DEFAULT_UNIT_FORCE / size;
}

function calculateMoveDistance(size, time) {
  return calculateSpeed(size) * (time/1000);
}

function calculateDistance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x) + Math.pow(point2.y - point1.y))
}

function calculateIsCollision(center1, radius1, center2, radius2) {
  radius2 = radius2 || 1;
  return calculateDistance(center1, center2) < (radius1 + radius2)
}

function calculateResultCoordinates(start, direction, distance) {
  return {
    x: start.x + Math.cos(direction) * distance,
    y: start.y + Math.sin(direction) * distance
  };
}

function calculateRadians(center, directionPoint) {
  var dy = directionPoint.y - center.y;
  var dx = directionPoint.x - center.x;
  return Math.atan2(dy, dx); 
}

function getMousePosition(canvas, e) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}