/**
 * @param {number} n
 * @return {number}
 */
var tribonacci = function (n) {
  let nubs = [0, 1, 1];

  for (let i = 3; i <= n; i++) {
    nubs[i] = nubs[i - 1] + nubs[i - 2] + nubs[i - 3];
  }

  return nubs[n];
};
