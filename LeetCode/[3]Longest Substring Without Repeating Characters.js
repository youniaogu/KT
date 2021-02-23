/**
 * @param {string} s
 * @return {number}
 */

var lengthOfLongestSubstring = function (s) {
  if (s === "") {
    return 0;
  }

  let max = 1,
    left = 0,
    m = new Map();
  for (let right = 0; right < s.length; right++) {
    if (m.has(s[right])) {
      left = Math.max(left, m.get(s[right]) + 1);
    }

    m.set(s[right], right);
    max = Math.max(max, right - left + 1);
  }

  return max;
};

const a = lengthOfLongestSubstring("abca");
