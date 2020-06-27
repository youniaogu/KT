### 怎么构建一个简易的 react-redux

注意：下文中的`state`均是指`redux`里存储的状态

在开始动手之前，先思考几个问题

1. 什么是 react-redux？
2. react-redux 是怎么工作的？

#### 一、什么是 react-redux？

通过名字可以知道，`react-redux`是作用在`react`和`redux`之间，通过 `connect`和`Provider`这两个 api，将组件需要的状态注入进去，当 redux 里的状态发生改变时，触发相应组件的更新

#### 二、react-redux 是怎么工作的？

先看一个简单的用例

```
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reducers from "./reducers"
import { createStore } from "redux";
import { Provider } from "react-redux";

const store = createStore(reducers);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

最外层`Provider`将整个应用包裹住

将`createStore`返回的`store`通过`props`传递给`Provider`

**store 并不是 redux 存储的状态**，要获得存储的状态必须通过 `store.getState()`

```
import React, { Component } from "react";
import { dispatchAdd, dispatchReduce } from "./actions";
import { connect } from "react-redux";

class Counter extends component {
  render() {
    return <div>{this.props.counter}</div>
  }
}

const mapStateToProps = function (state, ownProps) {
  return {
    counter: state.counter,
  };
}

const mapDispatchToProps = function (dispatch, ownProps) {
  return {
    add: dispatch(dispatchAdd),
    reduce: dispatch(dispatchReduce),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

在需要 redux 的状态时，组件通过 `connect` 将状态传递给组件

connect 有四个传参

1. `mapStateToProps?: Function` 将 state 注入到组件中
2. `mapDispatchToProps?: Function | Object` 将 action 注入到组件中
3. `mergeProps?: Function` 在前两个传参的返回和 ownProps 作为传参，返回合并后的 props
4. `options?: Object` 自定义传入的 context ，是否是需要比较前后状态以及比较的方法，转发 ref 返回原组件还是包装后的组件

大部分情况下我们只使用到前两个方法（本文也只会讲述这两部分）

通过上面用例可以知道

- `Provider` 负责传递`store`
- `connect` 负责接收`store`，并将`state`注入到组件中

`Provider`是通过什么进行`store`传递？
答案是：[Context](https://reactjs.org/docs/context.html)

什么是`Context`？

简单来说，`Context`是 React 提供的一种数据传递方式，`Context`能够自动的自上而下传递数据，不需要像`props`那样手动定义传递的数据，是一个**既方便又危险**的属性。'

如果想详细了解`Context`的详细用法和说明，可以去 React 官网查看[文档](https://reactjs.org/docs/context.html)

#### 三、开始动手

目标：实现`connect`和`Provider`

`connect`是函数，接收`mapStateToProps`和`mapDispatchToProps`，返回[hoc](https://reactjs.org/docs/higher-order-components.html)

`Provider`是组件，接收`store`并通过`Context`传递给其他组件

```
import React, { Component } from "react";
import PropTypes from "prop-types";

const StoreContext = React.createContext();

export function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    return class connect extends Component {
      render() {
        return <WrappedComponent {...this.props} />;
      }
    };
  };
}

export class Provider extends Component {
  render() {
    return (
      <StoreContext.Provider value={this.props.store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.element.isRequired,
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }),
};
```

上面就是`connect`和`Provider`最基础的定义

再来是`connect`接收`Context`，并通过传入的两个 map 方法将需要的`state`和`dispatch`注入到组件的`props`中

```
...

export function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    return class connect extends Component {
      static contextType = StoreContext;

      constructor(props, context) {
        super(props, context);

        this.store = props.store || context;
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToProps(this.store.getState(), this.props)}
            {...mapDispatchToProps(this.store.dispatch, this.props)}
          />
        );
      }
    };
  };
}

...
```

到这一步，已经将`state`和`dispatch`注入到组件，但触发`action`后并不会触发组件`render`，原因在于`state`变化后并没有重新渲染组件

所以这一步我们需要监听`state`的变化，并且在确认变化后，触发组件的`render`

```
import React, { Component } from "react";
import PropTypes from "prop-types";

const StoreContext = React.createContext();

export function connect(mapStateToProps, mapDispatchToProps) {
  return function wrapWithComponent (WrappedComponent) {
    return class Connect extends Component {
      static contextType = StoreContext;

      constructor(props, context) {
        super(props, context);

        this.store = props.store || context;
        this.state = {
          storeState: this.store.getState(),
        };
      }

      componentDidMount() {
        if (!this.unSubscribe) {
          this.unSubscribe = this.store.subscribe(
            this.handleStoreChange.bind(this)
          );
        }
      }

      componentWillUnmount() {
        if (this.unSubscribe) {
          this.unSubscribe();
          this.unSubscribe = null;
        }
      }

      handleStoreChange() {
        if (!this.unSubscribe) {
          return;
        }

        const prevStoreState = this.state.storeState;
        const storeState = this.store.getState();

        if (prevStoreState !== storeState) {
          this.setState({ storeState });
        }
      }

      render() {
        const storeState = this.state.storeState;

        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToProps(storeState, this.props)}
            {...mapDispatchToProps(this.store.dispatch, this.props)}
          />
        );
      }
    };
  };
}

export class Provider extends Component {
  render() {
    return (
      <StoreContext.Provider value={this.props.store}>
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

Provider.propTypes = {
  children: PropTypes.element.isRequired,
  store: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
  }),
};
```

在订阅后，每当触发一个`action`，就会触发`handleStoreChange`方法，里面将`prevStoreState`和`storeState`进行比较，只有触发的`reducers`返回原本的`state`时才会是 true

#### 问题

每当`action`触发`state`变化时，每个`WrappedComponent`都会`render`，即使没有用到改变的`state`，所以接下来我们在来说说 react-redux 做的浅比较

**待续......**

示例 demo：[github](https://github.com/youniaogu/simple-react-redux)

#### 参考资料

[React Redux with Dan Abramov](https://youtu.be/VJ38wSFbM3A)

[The History and Implementation of React-Redux]("https://blog.isquaredsoftware.com/2018/11/react-redux-history-implementation/")
