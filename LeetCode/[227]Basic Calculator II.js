/**
 * @param {string} s
 * @return {number}
 */
var calculate = function (s) {
  s = s.replace(/\s/g, "");

  let stack = [];
  let nub = 0;
  let prev = "+";

  for (let i = 0; i < s.length; i++) {
    const curr = s[i];

    if (/\d/.test(curr)) {
      nub = nub * 10 + Number(curr);
    }

    if (/[\+\-\*\/]/.test(curr) || i === s.length - 1) {
      if (prev === "+") {
        stack.push(nub);
      }
      if (prev === "-") {
        stack.push(-nub);
      }
      if (prev === "*") {
        stack.push(stack.pop() * nub);
      }
      if (prev === "/") {
        stack.push(Math.trunc(stack.pop() / nub));
      }

      prev = curr;
      nub = 0;
    }
  }

  return stack.reduce((a, b) => a + b);
};

// Reference: https://leetcode.com/problems/basic-calculator-ii/discuss/135740/Clean-JavaScript-solution

console.log(calculate("3+2+3"));
console.log(calculate("3+5 / 2"));
console.log(calculate("3/2"));
console.log(calculate("14-3/2"));
