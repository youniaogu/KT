/**
 * @param {number[]} prices
 * @param {number} fee
 * @return {number}
 */
var maxProfit = function (prices, fee) {
  let min = prices[0];
  let max = prices[0];
  let profit = 0;
  let currProfit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > max && prices[i] - min > fee) {
      max = prices[i];
      currProfit = max - min - fee;
    }

    if (prices[i] + fee < max) {
      profit = profit + currProfit;
      max = prices[i];
      min = prices[i];
      currProfit = 0;
    }

    if (prices[i] < min && max - min <= fee) {
      max = prices[i];
      min = prices[i];
    }
  }

  return profit + currProfit;
};

console.log(maxProfit([1, 3, 2, 8, 4, 9], 2)); //8
console.log(maxProfit([1, 4, 6, 2, 8, 3, 10, 14], 3)); //13
console.log(maxProfit([9, 8, 7, 1, 2], 3)); //0
console.log(maxProfit([1, 3, 7, 5, 10, 3], 3)); //6
console.log(maxProfit([2, 1, 4, 4, 2, 3, 2, 5, 1, 2], 1)); //4
