### 关于 history 的轻知识

本文讲解的是[history](https://github.com/ReactTraining/history)库，而不是 window.history

> 为了方便，下面所有的 globalHistory 都特指 window.history

#### 先简单介绍下 globalHistory 下的 api

- [pushState](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)：往历史栈里添加一个状态，
- [replaceState](https://developer.mozilla.org/zh-CN/docs/Web/API/History/replaceState)：替换历史栈最新的状态
- [back](https://developer.mozilla.org/zh-CN/docs/Web/API/History/back)：向后跳转，相当于点击浏览器回退按钮
- [forward](https://developer.mozilla.org/zh-CN/docs/Web/API/History/forward)：向前跳转，相当于点击浏览器前进按钮
- [go](https://developer.mozilla.org/zh-CN/docs/Web/API/History/go)：可以跳转到前进或后退的某一位置

相关的事件函数

- [onpopstate](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onpopstate)：当处于激活状态的历史栈发生变化时触发的事件，pushState 和 replaceState 不会触发，而 back、forward、go、点击浏览器前进后退按钮或者 a 标签跳转都会触发
- [onhashchange](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/onhashchange)：当 url 上的 hash(#后面的部分)发生变化时就会触发的事件

> 需要注意的是，pushState 或 reaplceState 修改 hash 与之前相同时，是不会触发 hashchange 事件的

前端路由有 history 和 hash 两种形式，除了显示形式不一样外，它们的事件处理是类似的，分别绑定 onpopstate 事件，hash 会多一个 onhashchange 事件，使用 pushState 和 reaplceState 封装 push 和 replace 方法

虽然 history 里返回实例里是 back、forward、go，但 react-router-dom 里返回的却是 goBack、goForward、go，命名不同但功能是一样的
