// /**
//  * @param {number[]} prices
//  * @return {number}
//  */
// var maxProfit = function (prices) {
//   let dp1 = [];
//   let cost1 = Infinity;
//   let cost2 = Infinity;
//   let profit1 = 0;
//   let profit2 = 0;

//   for (let i = 0; i < prices.length; i++) {
//     cost1 = Math.min(cost1, prices[i]);
//     profit1 = Math.max(profit1, prices[i] - cost1);
//     dp1[i] = profit1;
//   }

//   for (let i = 0; i < prices.length; i++) {
//     cost2 = Math.min(cost2, prices[i] - dp1[i]);
//     profit2 = Math.max(profit2, prices[i] - cost2);
//   }

//   return profit2;
// };

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (prices) {
  let cost1 = Infinity;
  let cost2 = Infinity;
  let profit1 = 0;
  let profit2 = 0;

  for (let i = 0; i < prices.length; i++) {
    cost1 = Math.min(cost1, prices[i]);
    profit1 = Math.max(profit1, prices[i] - cost1);

    cost2 = Math.min(cost2, prices[i] - profit1);
    profit2 = Math.max(profit2, prices[i] - cost2);
  }

  return profit2;
};

// 思路：
// 总利润 = 利润1 + 利润2
// 总利润 = 利润1 + 第二次卖出价 - 第二次买入价
// 总利润 = 第二次卖出价 - (第二次买入价 - 利润1)
// [最大]总利润 = [最大]第二次卖出价 - [最小](第二次买入价 - 利润1)
// [最大]总利润 = [最大]第二次卖出价 - [最小](第二次买入价 - [最大]利润1)
// 第一次DP得出[最大]利润1，第二次DP得出[最大]总利润

// Reference: https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/discuss/795861/JavaScript-DP-O-(n)-2-loops-intuitive-solution-with-A-LOT-of-explanations

console.log(maxProfit([3, 3, 5, 0, 0, 3, 1, 4])); //6
console.log(maxProfit([1, 2, 3, 4, 5])); //4
console.log(maxProfit([7, 6, 4, 3, 1])); //0
console.log(maxProfit([0])); //0
console.log(maxProfit([3, 2, 6, 5, 0, 3])); //7
console.log(maxProfit([6, 1, 3, 2, 4, 7])); //7
console.log(maxProfit([1, 2, 4, 2, 5, 7, 2, 4, 9, 0])); //13
