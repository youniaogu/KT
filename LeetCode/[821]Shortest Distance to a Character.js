/**
 * @param {string} s
 * @param {character} c
 * @return {number[]}
 */
var shortestToChar = function (s, c) {
  let ary = [];
  let len = s.length;
  let prev = Infinity;

  for (let i = 0; i < len; i++) {
    if (s[i] === c) {
      prev = i;
    }
    ary.push(Math.abs(prev - i));
  }

  prev = Infinity;

  for (let i = len - 1; i >= 0; i--) {
    if (s[i] === c) {
      prev = i;
    }
    ary[i] = Math.min(ary[i], prev - i);
  }

  return ary;
};

console.log(shortestToChar("loveleetcode", "e"));
console.log(shortestToChar("aaab", "b"));
console.log(shortestToChar("aaba", "b"));
console.log(shortestToChar("baab", "b"));

// Reference: https://leetcode.com/problems/shortest-distance-to-a-character/discuss/1054366/javascript-2-pass-simple-solution-with-explanation
