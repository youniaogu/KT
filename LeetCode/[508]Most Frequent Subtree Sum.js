/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var findFrequentTreeSum = function (root) {
  let max = 0;
  let result = [];
  const list = new Map();

  function loopTree(node) {
    if (node === undefined || node === null) {
      return 0;
    }

    const totalVal = loopTree(node.left) + loopTree(node.right) + node.val;

    let nub = 1;
    if (list.has(totalVal)) {
      nub = list.get(totalVal) + 1;
    }
    list.set(totalVal, nub);

    if (nub > max) {
      max = nub;
      result = [totalVal];
    } else if (nub === max) {
      result.push(totalVal);
    }

    return totalVal;
  }
  loopTree(root);

  return result;
};
