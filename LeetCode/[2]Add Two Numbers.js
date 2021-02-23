/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */

function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

var addTwoNumbers = function (l1, l2) {
  let n1 = l1,
    n2 = l2,
    n3 = undefined,
    next = 0,
    l3 = new ListNode();
  while (true) {
    let result = n1.val + n2.val + next;

    if (result >= 10) {
      next = 1;
      result = result - 10;
    } else {
      next = 0;
    }

    if (n3 === undefined) {
      l3.val = result;
      n3 = l3;
    } else {
      n3.next = new ListNode(result);
      n3 = n3.next;
    }

    if (n1.next === null && n2.next === null) {
      if (next !== 0) {
        n3.next = new ListNode(next);
        n3 = n3.next;
      }

      break;
    }

    n1 = n1.next || new ListNode();
    n2 = n2.next || new ListNode();
  }

  return l3;
};
