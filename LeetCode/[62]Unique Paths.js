/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
// 基于广度遍历 超时了
// var uniquePaths = function (m, n) {
//   let way = 1;
//   let stack = [];

//   const getNeighbors = function (x, y) {
//     return [
//       { x: x + 1, y },
//       { x, y: y + 1 },
//     ].filter(({ x, y }) => {
//       return x < m && y < n;
//     });
//   };

//   stack.push({ x: 0, y: 0 });
//   while (stack.length !== 0) {
//     const { x, y } = stack.shift();
//     const neighbors = getNeighbors(x, y);

//     if (neighbors.length > 1) {
//       way += neighbors.length - 1;
//     }

//     neighbors.forEach((item) => {
//       stack.push(item);
//     });
//   }

//   return way;
// };

/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
// 基于排列组合
var uniquePaths = function (m, n) {
  const factorialize = function (num) {
    if (num <= 0) {
      return 1;
    }

    return num * factorialize(num - 1);
  };

  return factorialize(m + n - 2) / (factorialize(m - 1) * factorialize(n - 1));
};
