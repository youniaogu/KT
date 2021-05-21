/**
 * @param {string} text
 * @param {string} first
 * @param {string} second
 * @return {string[]}
 */
var findOcurrences = function (text, first, second) {
  const words = text.split(" ");
  const output = [];

  if (words < 3) {
    return output;
  }

  for (let i = 2; i < words.length; i++) {
    if (words[i - 1] === second && words[i - 2] === first) {
      output.push(words[i]);
    }
  }

  return output;
};
