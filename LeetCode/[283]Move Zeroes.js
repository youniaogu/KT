/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */

// Solution:
// var moveZeroes = function (nums) {
//   let count = 0;
//   for (let i = 0; i + count < nums.length; i++) {
//     if (nums[i] === 0) {
//       nums.splice(i, 1);
//       nums.push(0);
//       count++;
//       i--;
//     }
//   }
// };

// Better Solution:
// Reference: https://leetcode.com/problems/move-zeroes/discuss/72422/JavaScript-solution
var moveZeroes = function (nums) {
  let j = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      if (i !== j) {
        nums[j] = nums[i];
        nums[i] = 0;
      }
      j++;
    }
  }
};
