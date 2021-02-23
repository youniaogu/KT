// /**
//  * @param {number[]} nums
//  * @return {number}
//  */
// var waysToSplit = function (nums) {
//   const len = nums.length;
//   const total = nums.reduce((dict, i) => {
//     return dict + i;
//   }, 0);

//   let left = 0,
//     a1 = 0,
//     result = 0;
//   for (let i = 0; i < len - 2; i++) {
//     if (a1 + nums[i] > total / 3) {
//       break;
//     }

//     a1 = a1 + nums[i];

//     let a2 = 0;
//     for (let n = i + 1; n < len - 1; n++) {
//       a2 = a2 + nums[n];
//       let a3 = total - a1 - a2;

//       if (a3 < a2) {
//         break;
//       }

//       if (a2 >= a1 && a3 >= a2) {
//         result++;
//       }
//     }
//   }

//   return result;
// };

/**
 * @param {number[]} nums
 * @return {number}
 */
var waysToSplit = function (nums) {
  const len = nums.length;
  const total = nums.reduce((dict, i) => dict + i);
  const lastIndex = len - 2;

  let i = 0;
  let n = -1;
  let j = -1;

  let a1 = 0;
  let a2 = 0;
  let a3 = 0;

  let result = 0;

  for (let i = 0; i < lastIndex; i++) {
    a1 += nums[i];
    a2 -= nums[i];
    a3 -= nums[i];

    while (n <= lastIndex && (n <= i || a2 < a1)) {
      n++;
      a2 += nums[n];
    }

    while (j <= lastIndex && (j < n || total - a1 - a3 >= a3)) {
      j++;
      a3 += nums[j];
    }

    result = (result + (j - n)) % 1000000007;
  }

  return result;
};

// Reference: https://leetcode.com/problems/ways-to-split-array-into-three-subarrays/discuss/999257/C%2B%2BJavaPython-O(n)-with-picture
