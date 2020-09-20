### react-router-dom 简单讲解

> 示例 demo：[github](https://github.com/youniaogu/simple-react-router-dom)
>
> 本文代码比较粗糙，有能力建议自行看源码

##### 1. 前言

react-router-dom 是基于`history`库开发的 react 路由管理库，这里主要简单讲解 react-router-dom 的 api，理解他们的作用和流程，**而`history`部分将不深入讨论**

> 下面的实现和讲解主要基于 class，无 hook 部分

##### 2. api 介绍

react-router-dom 主要有`BrowserRouter`、`HashRouter`、`Router`、`Switch`、`Route`、`Link`、`Redirect`、`withRouter` 这几个常用 api，其中 `BrowserRouter`、`HashRouter`是`Router`封装后的 api

- Router：接收`history`实例化后的对象，绑定`history`监听函数，并通过`context`传递下来
- BrowserRouter | HashRouter：分别基于`createBrowserHistory`和`createHashHistory`封装后的`Router`
- Switch：会按顺序依次匹配，只会将第一个匹配到的渲染出去
- Route：根据设定的 path 匹配当前的 pathname，判断是否渲染传递的 component 或者 children
- Link：类似于 a 标签，点击后进行路由跳转
- Redirect：当组件渲染时进行路由跳转
- withRouter：一个高阶组件，为组件提供`history`控制 api

> 官方文档里建议 Switch 的 children 应当为 Route 或 Redirect 组件，但实际其它组件或元素也是可行的，后面会说明原因

其中`BrowserRouter`、`HashRouter`、`Link`来自 react-router-dom，其它 api 都来自 react-router，react-router-dom 只是进行了转接而已

只所以分成 react-router-dom 和 react-router，是因为 react-router 不止服务于**web**，还有**native**环境，通用的 api 放在了 react-router，而基于 web 特定的 api 则放在了 react-router-dom

下面会贴出自己简化后的代码，来理解 api 的实现原理

##### 3. Router

1. 绑定`history`监听函数，当路由变化时修改 state
2. 将`location`、`history`和`match`通过`context`传递下去

> match 是当 Route 或组件未设置 path 时提供的默认值

```javascript
import React, { Component, createContext } from "react";

const RouterContext = createContext({});

export class Router extends Component {
  constructor(props) {
    super(props);

    this.state = {
      location: props.history.location,
    };
    this._isMounted = false;

    this.uninstall = props.history.listen(({ location }) => {
      if (this._isMounted) {
        this.setState({
          location,
        });
      }
    });
  }

  componentDidMount() {
    this._isMounted = true;
  }
  componentWillUnmount() {
    this.uninstall();
    this._isMounted = false;
  }

  render() {
    const { location } = this.state;
    const { history, children } = this.props;
    const value = {
      location,
      history,
      match: {
        path: "/",
        url: "/",
        params: {},
        isExact: location.pathname === "/",
      },
    };

    return (
      <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
    );
  }
}
```

设置`_isMounted`标记避免组件在尚未加载完成的情况下使用 setState

> 未加载完成的情况下使用 setState，严格模式下会报错，正常模式下会失败无提示

##### 4. BrowserRouter ｜ HashRouter

1. 使用`createBrowserHistory`和`createHashHistory`创建实例
2. 通过 props 传递给 Router

```javascript
...
import { createBrowserHistory, createHashHistory } from "history";

export class BrowserRouter extends Component {
  constructor(props) {
    super(props);

    this.history = createBrowserHistory(props);
  }

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}

export class HashRouter extends Component {
  constructor(props) {
    super(props);

    this.history = createHashHistory(props);
  }

  render() {
    return <Router history={this.history} children={this.props.children} />;
  }
}
```

##### 5. Switch

`Switch`里会像数组遍历那样遍历 children，依次将 props 上面的 path 或者 from 和 context 里的 location.pathname 进行比对，将第一个匹配成功的 children 渲染出来

而当组件上不存在 path 和 from 时，将会使用 context 上的 match 进行判断，下面简化代码里有判断的逻辑，从结果上来说，如果一个组件在`Switch`内**未设置** path 或 from，它将会是**默认匹配成功**，也就是**匹配任意 pathname**

> Switch 只关心 props 上的 path 和 from，只要组件设置了 path 或 from 属性，就能进行匹配，未设置的情况会匹配任意 pathname，这就是为什么我们能在 Switch 中使用 Route、Redirct 以外组件的原因

大家可以简单测试一下，在`Switch`最上面加上：

```html
<div path="math pathname">i am not Route or Redirct</div>
```

如果 path 命中，将会显示`i am not Route or Redirct`，而不是下面的组件

```html
<div>i am not Route or Redirct</div>
```

如果不设置 path，将会匹配任意 pathname

```javascript
...
export class Switch extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const { math, location } = context;

          let isMatch = false,
            element;
          React.Children.forEach(this.props.children, child => {
            if (!isMatch) {
              element = child;

              const path = child.props.path || child.props.from

              isMatch = path ? location.pathname === path : math;
            }
          });

          if (element && isMatch) {
            return cloneElement(element, { location, computedMatch: match });
          }
          return null;
        }}
      </RouterContext.Consumer>
    );
  }
}
```

`Switch`里使用了 React.Children.forEach 去遍历 children，除 forEach 外还有 map、count、only、toArray 一共五个 api

我们知道 forEach 遍历是不能中断的，而 find、some 等方法在满足条件后会自动退出遍历，性能上会比 forEach 更好，为什么这里要用 forEach？

![3.png](../static/3.png)

源码里注释解释了为什么不用 toArray().find 而是 forEach，原因在于 toArray 需要给每个 children 添加 key，当多个 Route 使用同一个 component 的时候，会出现同时触发一个组件的 unmount 和 remount 的情况，他们不希望这样

##### 5. Route

`Route`的工作很单一，根据是否匹配来判断是否渲染组件

> 在未设置 path 的情况下，Route 会直接渲染组件

```javascript
...
export class Route extends Component {
  render() {
    return (
      <RouterContext.Consumer>
        {context => {
          const { match, path, children } = this.props;
          const { location } = context;

          const isMatch = match ? match : path ? location.pathname === path : context.match;

          if (isMatch) {
            return children;
          } else {
            return null;
          }
        }}
      </RouterContext.Consumer>
    );
  }
}
```

##### 6. Link

下面代码虽然能实现相应的功能，但与源码相差较大，源码里关于 ref 的转发做了比较多的操作，建议直接参考源码的实现

```javascript
...
export class Link extends Component {
  handleClick = method => {
    return event => {
      event.preventDefault();

      method(this.props.to);
    };
  };

  render() {
    const { to, replace, children, ...otherProps } = this.props;

    return (
      <RouterContext.Consumer>
        {context => {
          const { history } = context;
          const method = replace ? history.replace : history.push;

          return (
            <a href={to} onClick={this.handleClick(method)}>
              {children}
            </a>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}
```

##### 7. Redirect

官方没有用 class 实现`Redirect`，而是设计为 function 类型，返回`Lifecycle`组件，使用`Lifecycle`的生命周期来触发跳转，并没有直接跳转，而是稍微绕了一下

> 这么设计的原因，个人猜测是为了代码统一使用 Consumer 的形式，而 constructor 里不能使用 Consumer，导致 Redirct 无法在 didmount 之前获取 context，所以改成 function 形式。

下面是我将`Redirect`作为一个组件来实现的例子：

```javascript
...
export class Redirect extends Component {
  static contextType = RouterContext;

  constructor(props, context) {
    super(props, context);

    const { push = false } = props;
    const { history } = context;

    this.method = push ? history.push : history.replace;
  }

  componentDidMount() {
    this.method(this.props.to);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.to !== this.props.to) {
      this.method(this.props.to);
    }
  }

  render() {
    return null;
  }
}
```

##### 8. withRouter

为了满足其他组件能够手动的进行路由跳转，需要将`history`对象暴露出来

> 使用 hoc 的时候，传递 props 和 ref 同时还需要复制静态方法，参考：[hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)

```javascript
...
export function withRouter(WrapComponent) {
  class WrappedComponent extends Component {
    render() {
      return (
        <RouterContext.Consumer>
          {context => {
            return <WrapComponent {...this.props} {...context} />;
          }}
        </RouterContext.Consumer>
      );
    }
  }

  return hoistStatics(WrappedComponent, WrapComponent);
}
```

##### 8. 写在最后

在看了源码并简单实现后，让我惊讶的是 Link 比想象中要复杂很多，以及 pathname 的匹配方法，还有 Switch 的匹配方式

希望这篇文章能对你有所帮助，谢谢
