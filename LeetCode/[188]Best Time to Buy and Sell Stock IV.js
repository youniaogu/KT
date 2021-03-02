// Input: k = 2, prices = [2,4,1]
// Output: 2
// Explanation: Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.

// Input: k = 2, prices = [3,2,6,5,0,3]
// Output: 7
// Explanation: Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.

// Input: k = 2, prices = [1, 2, 3, 4, 5]
// Output: 4

/**
 * @param {number} k
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function (k, prices) {
  const len = prices.length;
  let cost = Infinity;
  let profit = 0;
  let dp = new Array(len).fill(0);

  for (let n = 0; n < k; n++) {
    //注意重置cost和profit
    cost = Infinity;
    profit = 0;

    for (let o = 0; o < len; o++) {
      cost = Math.min(cost, prices[o] - dp[o]);
      profit = Math.max(profit, prices[o] - cost);
      dp[o] = profit;
    }
  }
  return profit;
};

// 参考第[123]题
// 两次利润 = max 2次卖出 - min（2次买入 - 1次利润）
// 三次利润 = 第3次卖出 - 第3次买入 + 第2次卖出的利润 + 第1次卖出的利润
// 三次利润 = 第3次卖出 - (第3次买入 - (第2次卖出的利润 + 第1次卖出的利润))
// 三次最大利润 = (max)第3次卖出 - (min)(第3次买入 - (第2次卖出的利润 + 第1次卖出的利润))
// k次最大利润 = (max)第k次卖出 - (min)(第k次买入 - (第k-1次卖出的利润 + ... + 第1次卖出的利润))

console.log(maxProfit(2, [2, 4, 1])); //2
console.log(maxProfit(1, [1, 2])); //1
console.log(maxProfit(4, [1, 2, 4, 2, 5, 7, 2, 4, 9, 0])); //15
