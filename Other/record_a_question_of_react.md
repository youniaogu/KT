### 记一个 react 问题

#### 1. 前言

前几天看到一篇文章：[我在大厂写 React，学到了什么？性能优化篇](https://juejin.im/post/6889247428797530126)，文章最开始提到了神奇的`children`，讲诉使用`children`避免了不必要的渲染，蛮有意思的。而这篇文章，主要是分享我对文章中问题的理解，同时梳理了关于 react 渲染机制的知识

#### 2. 问题是什么？

文中`ChildNonTheme`里没有依赖 context，但修改 context 的时候，为什么会触发渲染？

因为父节点发生改变时(state、props、context)，子节点无论怎么样都会重新渲染，就是这么简单

如果需要追根溯源的话，根本原因是 react diff 算法在比较新旧节点的时候，如果父节点发生改变，将会直接替换整个节点，而不会对子节点进行比较。所以即使`ChildNonTheme`里的状态没发生改变，也会重新渲染

#### 3. 怎么解决？

文中使用`children`方法之所以能够解决问题，个人认为`ChildNonTheme`此时并不属于`ThemeApp`的子节点，而是属于`App`，所以`ThemeApp`节点改变时，并不能触发`ChildNonTheme`的渲染（**单纯个人猜测，如有更好解释或发现错误，欢迎指出**）

除了`children`外，还可以使用`React.memo`，对应 Component 写法是`React.PureComponent`，这样不需要改变代码结构，更加方便
