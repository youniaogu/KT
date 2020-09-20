### 面试题

##### 1. 实现关键字

```javascript
function New(fn, ...args) {
  let obj = new Object();

  obj.__proto__ = fn.prototype;

  const ret = fn.apply(this, args);

  if (ret instanceof Object) {
    return ret;
  }

  return obj;
}
```

##### 2. [Array.prototype.flat](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

flat 的作用是根据指定的数组深度摊平数组，可以使用 [Infinity](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Infinity)(无穷大)展开任意深度的数组

```javascript
var newArray = arr.flat([depth]);
```

depth 深度是可选，默认为 1

下面是使用 concat 和 reduce 模拟的 flat

```javascript
var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];

function flatDeep(arr, d = 1) {
  return d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
        []
      )
    : arr.slice();
}

flatDeep(arr1, Infinity);
```

##### 3. [下面的代码打印什么内容，为什么？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/48)

```javascript
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
```

- 非匿名自执行函数，函数名只读(类似常量)
- 非严格模式下给常量命名静默失败
- 严格模式下给常量命名报错 TypeError
