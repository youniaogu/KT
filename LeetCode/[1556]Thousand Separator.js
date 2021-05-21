/**
 * @param {number} n
 * @return {string}
 */
var thousandSeparator = function (n) {
  const ary = String(n).split("");
  const len = ary.length;
  const result = [];

  for (let i = len - 1; i >= 0; i--) {
    const diff = len - i - 1;
    if (diff !== 0 && diff % 3 === 0) {
      result.unshift(".");
    }
    result.unshift(ary[i]);
  }

  return result.join("");
};
