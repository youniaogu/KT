// Input: prices = [3,3,5,0,0,3,1,4]
// Output: 6
// Explanation: Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.
// Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.

// Input: prices = [1,2,3,4,5]
// Output: 4
// Explanation: Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
// Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.

// Input: prices = [7,6,4,3,1]
// Output: 0
// Explanation: In this case, no transaction is done, i.e. max profit = 0.

// Input: prices = [1]
// Output: 0

/**
 * @param {number[]} prices
 * @return {number}
 */
// var maxProfit = function (prices) {
//   let min = prices[0];
//   let max = prices[0];
//   let profit1 = 0;
//   let profit2 = 0;
//   let currProfit = 0;

//   for (let i = 1; i < prices.length; i++) {
//     if (prices[i] > max) {
//       max = prices[i];
//       currProfit = max - min;
//     }

//     if (prices[i] < max) {
//       currProfit = Math.max(prices[i - 1] - min, profit1);
//       profit1 = Math.min(profit2, currProfit);
//       profit2 = Math.max(profit2, currProfit);

//       min = prices[i];
//       max = prices[i];
//     }
//   }

//   profit1 = Math.min(profit2, currProfit);
//   profit2 = Math.max(profit2, currProfit);

//   return profit1 + profit2;
// };

var maxProfit = function (prices) {
  let t1Cost = Infinity,
    t2Cost = Infinity;
  let t1Profit = 0,
    t2Profit = 0;
  for (let i = 0; i < prices.length; i++) {
    t1Cost = Math.min(t1Cost, prices[i]);
    t1Profit = Math.max(t1Profit, prices[i] - t1Cost);

    t2Cost = Math.min(t2Cost, prices[i] - t1Profit);
    t2Profit = Math.max(t2Profit, prices[i] - t2Cost);
  }
  return t2Profit;
};

// console.log(maxProfit([3, 3, 5, 0, 0, 3, 1, 4])); //6
// console.log(maxProfit([1, 2, 3, 4, 5])); //4
// console.log(maxProfit([7, 6, 4, 3, 1])); //0
// console.log(maxProfit([0])); //0
// console.log(maxProfit([3, 2, 6, 5, 0, 3])); //7
// console.log(maxProfit([6, 1, 3, 2, 4, 7])); //7
console.log(maxProfit([1, 2, 4, 2, 5, 7, 2, 4, 9, 0])); //13
