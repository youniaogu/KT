/**
 * @param {number[]} A
 * @param {number} L
 * @param {number} R
 * @return {number}
 */
// var numSubarrayBoundedMax = function (A, L, R) {
//   let nub = 0;

//   for (let i = 0; i < A.length; i++) {
//     let max = 0;
//     for (let j = i; j < A.length; j++) {
//       max = Math.max(A[j], max);
//       if (max >= L && max <= R) {
//         nub++;
//       } else if (max > R) {
//         break;
//       }
//     }
//   }

//   return nub;
// };

var numSubarrayBoundedMax = function (A, L, R) {
  let dp = 0;
  let prev = -1;
  let nub = 0;

  for (let i = 0; i < A.length; i++) {
    if (A[i] < L) {
      nub += dp;
    } else if (A[i] > R) {
      dp = 0;
      prev = i;
    } else if (A[i] >= L && A[i] <= R) {
      dp = i - prev;
      nub += dp;
    }
  }

  return nub;
};

// DP solution reference from: https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/discuss/117723/Python-standard-DP-solution-with-explanation

// console.log(numSubarrayBoundedMax([2, 1, 4, 3], 2, 3));
// console.log(numSubarrayBoundedMax([2, 9, 2, 5, 6], 2, 8));
