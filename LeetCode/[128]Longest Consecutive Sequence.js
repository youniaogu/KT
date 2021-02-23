/**
 * @param {number[]} nums
 * @return {number}
 */
// var longestConsecutive = function (nums) {
//   if (nums.length === 0) {
//     return 0;
//   }

//   const ary = nums
//     .sort((i, j) => i - j)
//     .filter(function (item, index, arr) {
//       return arr.indexOf(item) === index;
//     });

//   let max = 1,
//     index = 1;
//   for (let i = 1; i < ary.length; i++) {
//     let a = ary[i];
//     let b = ary[i - 1];
//     if (Math.abs(a - b) === 1) {
//       index++;
//     } else {
//       index = 1;
//     }
//     max = Math.max(max, index);
//   }

//   return max;
// };

/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function (nums) {
  if (nums.length === 0) {
    return 0;
  }

  const set = new Set(nums);

  let max = 0;
  for (let num of set) {
    if (!set.has(num - 1)) {
      let currMax = 1;
      let currNum = num;

      while (set.has(currNum + 1)) {
        currNum++;
        currMax++;
      }

      max = Math.max(max, currMax);
    }
  }

  return max;
};

// Reference: https://leetcode.com/problems/longest-consecutive-sequence/discuss/139940/Simple-JavaScript-O(n)-solution
// method 1 hash set
