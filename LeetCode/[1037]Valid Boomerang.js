/**
 * @param {number[][]} points
 * @return {boolean}
 */
var isBoomerang = function (points) {
  const [p1, p2, p3] = points;
  const x1 = p1[0],
    y1 = p1[1],
    x2 = p2[0],
    y2 = p2[1],
    x3 = p3[0],
    y3 = p3[1];

  if (
    (x1 === x2 && y1 === y2) ||
    (x2 === x3 && y2 === y3) ||
    (x1 === x3 && y1 === y3)
  ) {
    return false;
  }

  return (y2 - y1) / (x2 - x1) !== (y3 - y2) / (x3 - x2);
};
