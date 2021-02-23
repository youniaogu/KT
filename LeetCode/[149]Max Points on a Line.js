/**
 * @param {number[][]} points
 * @return {number}
 */
var maxPoints = function (points) {
  if (points.length === 0) {
    return 0;
  }

  let max = 1;
  for (let n = 0; n < points.length - 1; n++) {
    for (let i = n + 1; i < points.length; i++) {
      const p1 = points[n],
        p2 = points[i];
      const x1 = p1[0],
        y1 = p1[1],
        x2 = p2[0],
        y2 = p2[1];

      let index = 0;
      if (x1 === x2) {
        for (let j = n + 1; j < points.length; j++) {
          if (j !== i) {
            if (points[j][0] === x1) {
              index++;
            }
          }
        }
      } else if (y1 === y2) {
        for (let j = n + 1; j < points.length; j++) {
          if (j !== i) {
            if (points[j][1] === y1) {
              index++;
            }
          }
        }
      } else {
        const k1 = ((y2 - y1) / (x2 - x1)) * 1000000;

        for (let j = n + 1; j < points.length; j++) {
          if (j !== i) {
            const x3 = points[j][0],
              y3 = points[j][1];

            if ((y3 === y1 && x3 === x1) || (y3 === y2 && x3 === x2)) {
              index++;
            } else {
              const k2 = ((y3 - y1) / (x3 - x1)) * 1000000;
              const k3 = ((y3 - y2) / (x3 - x2)) * 1000000;
              if (k1 === k2 && k2 === k3 && k1 === k3) {
                index++;
              }
            }
          }
        }
      }

      max = Math.max(max, index + 2);
    }
  }

  return max;
};
