function distanceBetweenPoints(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}

function isCollision(center1, radius1, center2, radius2) {
  radius2 = radius2 || 1;
  return distanceBetweenPoints(center1, center2) < (radius1 + radius2)
}

module.exports = {
  distanceBetweenPoints: distanceBetweenPoints,
  isCollision: isCollision
}