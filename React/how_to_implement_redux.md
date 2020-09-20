### 如何实现 Redux

> 示例 demo：[github](https://github.com/youniaogu/simple-redux)
>
> 注意：为了简单明了的展示主要流程，下面示例中均会省略异常情况的处理。

`redux`里有四个核心的 api，下面会按顺序介绍并实现它们

1. combineReducer
2. compose
3. createStore
4. applyMiddlewares

#### 一、combineReducer

###### 1. combineReducer 是什么，有什么用？

因为`createStore`只能接收一个`reducer`，如果把所有的`reducer`都写在一起的话会很臃肿，所以需要将其分割为一个个小的`reducer`，分别负责一部分的 state，再合并成一个`rootReducer`。

`combineReducer`的作用就是将多个`reducer`合并成一个

> 合并后返回的 reducer 在处理 state 时会进行分发，从上面接收 state 后会将对应部分的 state 分发给 reducer
>
> 不理解的话，可以看下边的执行前后代码

###### 2. combineReducer 执行前后代码

```javascript
export default combineReducer({
  list: listReducers,
  dict: dictReducers,
  detail: detailReducers
});

//↓↓↓等价于↓↓↓

export default function(state, action) {
  return {
    list: listReducers(state.list, action),
    dict: dictReducers(state.dict, action),
    detail: detailReducers(state.detail, action)
  };
}
```

###### 3. 实现 combineReducer

遍历传入的对象拿到所有的 key 值，使用 key 值拿到对应的旧状态，将旧状态和动作传入`reducer`，获取最新状态并返回，实现起来并不复杂。

```javascript
function combineReducer(reducers) {
  const reducerKeys = Object.keys(reducers);

  return function(state, action) {
    const nextState = {};
    for (let i = 0; i < reducerKeys.length; i++) {
      const key = reducerKeys[i];
      const reducer = reducers[key];
      const prevState = state[key];
      const nextState = reducer(prevState, action);

      result[key] = nextState;
    }
    return result;
  };
}
```

###### 4. redux 是如何实现 combineReducer？

对比下源码

```javascript
function combineReducer(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  return function(state = {}, action) {
    let hasChange = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[i];
      const prevStateForKey = state[key];
      const nextStateForKey = reducer(prevStateForKey, action);

      nextState[key] = nextStateForKey;
      hasChange = hasChange || nextStateForKey !== prevStateForKey;
    }
    return hasChange ? nextState : state;
  };
}
```

需要注意的点：

- 除函数以外的值会被过滤，只处理对象里的函数。
- 在返回函数里会比较前后状态，如果未变化则返回旧状态

#### 二、compose

###### 1. compose 有什么作用？

`compose`主要用于中间件的整合，接收多个函数传参，返回单个函数。当执行返回函数时，相当于嵌套执行传参的函数。

说起来比较绕，可以看下边的例子理解

```javascript
compose(a, b, c); // a b c Function

//↓↓↓等价于↓↓↓

function Fn(...args) {
  return a(b(c(...args)));
}
```

###### 2. 如何实现？

思路很简单，可以用循环遍历，返回嵌套函数，也可以用`reduce`方法

```javascript
//第一种
function compose(...fns) {
  if (fns.length === 0) {
    return arg => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  let composeFn = (...args) => fns[0](...args);

  for (let i = 1; i < fns.length; i++) {
    composeFn = composeFn((...args) => fns[i](...args));
  }

  return composeFn;
}

//第二种
function compose(...fns) {
  if (fns.length === 0) {
    return arg => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce((a, b) => {
    return (...args) => a(b(...args));
  });
}
```

#### 三、createStore

`createStore`最多可以接收三个传参，分别是`reducer, preloadedState, enhancer`

> `reducer`为必传项，`preloadedState`和`enhancer`为非必传，当只传递两个参数时，`createStore`会检查第二个参数的类型，如何是 function 类型的话按`enhancer`处理，其他情况会当作`preloadedState`

- `reducer`：响应 action，更新 state
- `preloadState`：初始化 state
- `enhancer`：`applyMiddlewares`返回的函数，用于增强`dispatch`的功能

`reducer`方法传参里提供初始值也可以达到初始化 state 的效果，但和使用`preloadState`存在一些区别

> `preloadState`初始化 state 在`createStore`执行时生效，而函数传参初始值必须要在触发动作并执行 reducer 函数后才会生效，但事实上，`createStore`_在返回结果前会主动触发一个初始化动作_（指 action），所以这两者都能达到初始化 state 的效果。
>
> 实际开发中初始化数据放在 reducer 里多一些，分割初始状态的同时也能直观看到对应的状态

`createStore`返回`{dispatch<Function>, getState<Function>, subscribe<Function>}`

###### 1. 定义 createStore 的传参和输出

```javascript
function createStore(reducer, enhancer) {
  let currentState,
    listeners = [];

  function dispatch() {}
  function subscribe() {}
  function getState() {}

  return {
    dispatch,
    subscribe,
    getState
  };
}
```

确认`dispatch`、`getState`、`subscribe`的作用

- `dispatch`：触发一个动作，修改 state，并触发所有的监听函数
- `getState`：返回当前的 state
- `subscribe`：订阅监听函数，返回取消订阅方法

###### 2. 补全方法

```javascript
function createStore(reducer, enhancer) {
  let currentState,
    listeners = [];

  function dispatch(action) {
    currentState = reducer(currentState, action);

    for (let i = 0; i < listeners.length; i++) {
      listeners[i]();
    }
  }
  function subscribe(handleStoreChange) {
    listeners.push(handleStoreChange);

    return function unsubscribe() {
      const index = listeners.indexOf(handleStoreChange);

      listeners.splice(index, 1);
    };
  }
  function getState() {
    return currentState;
  }

  dispatch({ type: "INIT" }); // 初始化

  return {
    dispatch,
    subscribe,
    getState
  };
}
```

#### 四、applyMiddleware

###### 1. 中间件

传入的中间件必须是规定的柯里化函数`({ getState, dispatch }) => next => action`。

> next 为下一个中间件，只有当最后一个中间件时才会是 dispatch

可以简单理解为：

```javascript
({ getState, dispatch }) => next => action;

//↓↓↓等价于↓↓↓

function middleware({ getState, dispatch }) {
  return function(next) {
    return function(action) {
      // ...do something
      return next(action);
    };
  };
}
```

执行中间件需要提前传递`getState、dispatch`，以及绑定 next

> 这部分代码不多，但复杂程度却是最高的，建议提前看下源码或是了解下洋葱模型。

###### 2. 源码(简化版)

```javascript
function createStore(reducer, enhancer) {
  ...

  if (typeof enhancer === "function") {
    return enhancer(createStore)(reducer);
  }

  ...
}

function applyMiddleware(...middlewares) {
  return function(createStore) {
    return function(reducer) {
      const store = createStore(reducer);

      let chain = [];
      let dispatch = store.dispatch;

      const middlewareAPI = {
        dispatch: action => dispatch(action),
        getState: store.getState
      }
      chain = middlewares.map(middleware => middleware(middlewareAPI));
      dispatch = compose(...chain)(store.dispatch);

      return {
        ...store,
        dispatch
      };
    };
  };
}
```

当`createStore`传入中间件时，会把自己传给`enhancer`，在里面进行`store`的创建，以及`dispatch`的绑定。

其中最重要最复杂的绑定部分代码，只有两条。

```javascript
chain = middlewares.map(middleware => middleware(middlewareAPI));
dispatch = compose(...chain)(store.dispatch);
```

- 第一：使用`map`为每个中间绑定`dispatch、getState`
- 第二：通过`compose`合并成一个函数，传递`dispatch`绑定中间件里的 next，得到新的`dispatch`。

第一句很好理解，第二句也不难，`compose`上面有讲解，最后剩下一点，那就是 next 的绑定。

###### 3. 绑定 next

中间件定义伪代码。

```javascript
//中间件A
function middlewareA(next_A) {
  return function(action) {
    // do something for middlewareA
    return next_A(action);
  };
}
//中间件B
function middlewareB(next_B) {
  return function(action) {
    // do something for middlewareB
    return next_B(action);
  };
}
```

next 绑定伪代码。

```javascript
//chain === [middlewareA, middlewareB]
compose(...chain);
↓↓↓相当于↓↓↓
function composedFn(...args) {
  return middlewareA(middlewareB(...args));
}

composedFn(dispatch);
↓↓↓相当于↓↓↓
middlewareA(middlewareB(dispatch);
↓↓↓相当于↓↓↓
middlewareA(function next_B(action) {
  // do something for middlewareB
  return dispatch(action);
});
↓↓↓相当于↓↓↓
function next_A(action) {
  // do something for middlewareA
  return function (action) {
    // do something for middlewareB
    return dispatch(action); // 等价于之前的return next_B(action)
  }(action); // 等价于之前的return next_A(action)
}
```

###### 4. 绑定顺序和执行顺序

`applyMiddleware`可以接收多个中间件传参，并从右到左依次绑定中间件，但当`dispatch`时，中间件的执行顺序却是从左到右（这也是为什么`redux-logger`要放在最后面）。

为什么执行顺序是相反的，可以通过下面的模型理解

```
 ———————————
| dispatch  |
 ———————————

↓↓↓绑定中间件↓↓↓

 -------------------
|    redux-thunk    |
|  ---------------  |
| |  redux-logger | |
| |  ———————————  | |
| | | dispatch  | | |
| |  ———————————  | |
|  ---------------  |
 -------------------
```

绑定中间件相当于在`dispatch`外包一层又一层的裹上，而当执行中间件时则需要从外到内顺序执行，所以执行顺序和绑定顺序是相反的

###### 5. 实现

观看还不够，只有实际动手后才会明白里面的细节和关键，最后是我的实现。

```javascript
function applyMiddleware(...middlewares) {
  return function({ getState, dispatch }) {
    return function(next) {
      return compose(
        ...middlewares.map(middleware => {
          return middleware({ getState, dispatch });
        })
      )(next);
    };
  };
}


function createStore(reducer, enhancer) {
  let dispatch = function(action) {
    ...
  };
  const subscribe = function(handleStoreChange) {
    ...
  };
  const getState = function() {
    ...
  };

  let currentState = {};
  let listeners = [];
  let dispatchWithMiddleware = dispatch;

  dispatch({ type: "INIT" }); // 初始化
  if (typeof enhancer === "function") {
    dispatchWithMiddleware = enhancer({
      dispatch: action => dispatchWithMiddleware(action),
      getState
    })(dispatch);
  }

  return {
    dispatch: dispatchWithMiddleware,
    subscribe,
    getState
  };
}
```

写法上有区别，但核心内容上没有区别。

###### 6. 注意

可能有些人已经注意到了奇怪的地方。

```javascript
//为什么不直接传dispatch
{
  dispatch, getState;
}
//而是传递匿名函数
{
  dispatch: action => dispatchWithMiddleware(action), getState;
}
```

原因在于有些中间件会使用绑定的`dispatch`方法，比如`redux-thunk`，所以要保证**传入的`dispatch`与外部`dispatchWithMiddleware`保持相同**。

`dispatchWithMiddleware`为引用类型，在绑定中间件后又会重新赋值，所以这里最好的解法就是“闭包”，将变量存在内存里维持起来。

所以这里传入函数，是为了触发闭包维持变量。

#### 参考资料

[Redux 从设计到源码](https://tech.meituan.com/2017/07/14/redux-design-code.html)

[图解 Redux 中 middleware 的洋葱模型](https://github.com/fi3ework/blog/issues/14)
