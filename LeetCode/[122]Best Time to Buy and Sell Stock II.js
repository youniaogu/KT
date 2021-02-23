/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let min = prices[0];
  let max = prices[0];
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < max) {
      profit += max - min;
      min = prices[i];
      max = prices[i];
    }

    if (prices[i] >= max) {
      max = prices[i];
    }
  }

  return profit + max - min;
};

console.log(maxProfit([7, 1, 5, 3, 6, 4])); //7
console.log(maxProfit([1, 2, 3, 4, 5])); //4
console.log(maxProfit([7, 6, 4, 3, 1])); //0
