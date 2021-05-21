/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */
var hasPathSum = function (root, targetSum, max = 0) {
  if (!root) {
    return false;
  }

  max += root.val;
  if (!root.left && !root.right) {
    if (max === targetSum) {
      return true;
    }

    return false;
  }

  return (
    (root.left ? hasPathSum(root.left, targetSum, max) : false) ||
    (root.right ? hasPathSum(root.right, targetSum, max) : false)
  );
};

// Optionmation version
// var hasPathSum = function (root, targetSum) {
//   if (!root) {
//     return false;
//   }

//   targetSum -= root.val;
//   if (!root.left && !root.right) {
//     if (targetSum === 0) {
//       return true;
//     }

//     return false;
//   }

//   return hasPathSum(root.left, targetSum) || hasPathSum(root.right, targetSum);
// };
