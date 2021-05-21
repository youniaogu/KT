// overtime, bad answer
// var wordBreak = function (s, wordDict) {
//   if (s.length === 0) {
//     return true;
//   }

//   let canBreak = false;
//   for (let i = 0; i < wordDict.length; i++) {
//     if (canBreak) {
//       break;
//     }

//     const word = wordDict[i];
//     if (word.length <= s.length) {
//       if (word === s.slice(0, word.length)) {
//         canBreak = wordBreak(s.slice(word.length), wordDict);
//       }
//     }
//   }

//   return canBreak;
// };

/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function (s, wordDict) {
  const ary = new Set([s]);

  for (let str of ary) {
    for (let i = 0; i < wordDict.length; i++) {
      const word = wordDict[i];

      if (word.length <= str.length) {
        if (word === str.slice(0, word.length)) {
          ary.add(str.slice(word.length));
        }
      }
    }
  }

  return ary.has("");
};

// Reference: https://leetcode.com/problems/word-break/discuss/528858/Fastest-JavaScript-BFS-44ms

console.log(wordBreak("leetcode", ["leet", "code"]));
console.log(wordBreak("applepenapple", ["apple", "pen"]));
console.log(wordBreak("catsandog", ["cats", "dog", "sand", "and", "cat"]));
console.log(
  wordBreak(
    "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaab",
    [
      "a",
      "aa",
      "aaa",
      "aaaa",
      "aaaaa",
      "aaaaaa",
      "aaaaaaa",
      "aaaaaaaa",
      "aaaaaaaaa",
      "aaaaaaaaaa",
    ]
  )
);
