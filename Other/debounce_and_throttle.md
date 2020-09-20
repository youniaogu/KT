### 防抖和节流

防抖和节流是 js 处理高频事件函数时经常会用到，通过降低函数的执行次数达到节约资源的目的，是前端常用的一种优化手段

- 防抖：延迟事件函数，n 秒后执行，如果 n 秒内事件又被触发时重新计时
- 节流：事件函数 n 秒内只能执行一次，执行完后倒计时开始

###### 1. 防抖

```javascript
function debounce(timescope) {
  return function (fn) {
    let timeout = null;

    return function () {
      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(() => {
        fn.apply(this, arguments);
      }, timescope);
    };
  };
}
```

###### 2. 节流

```javascript
function throttle(timescope) {
  return function (fn) {
    let cooldown = false;

    return function () {
      if (cooldown) {
        return;
      }

      cooldown = true;
      fn.apply(this.arguments);

      setTimeout(() => {
        cooldown = false;
      }, timescope);
    };
  };
}
```

##### 3. 比较

防抖和节流的区别在于：

1. 是否延迟事件函数执行
2. 重复触发事件函数是否重新倒计时

相同点：

1. 都是为了降低事件函数执行的频率

##### 4. 应用场景

- input 框需要根据输入的内容实时查询结果，可以在输入停止一段时间后再进行查询，这是防抖
- 点击按钮提交表单时，为了防止重复提交，一段时间内或者到提交完成前不允许提交，这是节流
