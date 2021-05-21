/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} s
 * @param {TreeNode} t
 * @return {boolean}
 */
var isSubtree = function (s, t) {
  if (!s) {
    return false;
  }

  return isEqual(s, t) || isSubtree(s.left, t) || isSubtree(s.right, t);
};

function isEqual(node1, node2) {
  if (!node1 || !node2) {
    return !node1 && !node2;
  }

  if (node1.val !== node2.val) {
    return false;
  }

  return isEqual(node1.left, node2.left) && isEqual(node1.right, node2.right);
}

// Reference: https://leetcode.com/problems/subtree-of-another-tree/discuss/102810/Concise-JavaScript-solution-using-DFS
