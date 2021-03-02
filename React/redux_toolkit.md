### redux-toolkit 介绍与实践

#### 1. 什么是 redux-toolkit？

redux-toolkit 下面简称为 rtk，是一个结合 redux 工具和语法糖的库，目的是为了解决三个问题

- redux 配置复杂
- redux 需要添加一些库配合使用
- redux 模版代码过多

#### 2. configureStore、createAction、createReducer

`configureStore`与`Redux.createStore`类似，都是返回 store 对象

由`configureStore`创建可以选择是否使用默认的中间件

- redux-thunk
- immutability-check
- serializability-check

默认的中间件支持[开关和配置](https://redux-toolkit.js.org/api/getDefaultMiddleware#customizing-the-included-middleware)

```javascript
import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import rootReducer from "./reducer";
import rootSaga from "./saga";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = getDefaultMiddleware({
      thunk: false,
    }).concat(sagaMiddleware);

    if (process.env.NODE_ENV === "development") {
      middlewares.concat(logger);
    }
    sagaMiddleware.run(rootSaga);

    return middlewares;
  },
});
```

`createAction`类似于`actionCreater`的形式，两者在传参和返回上有些不同

```javascript
function createAction(type, prepareAction?)
```

`createReducer`用来简化创建 reducer 的函数，内部使用[immer](https://github.com/immerjs/immer)大大简化了数据变更的操作

使用`switch`方式实现的`userReducer`

```javascript
const initialUserState = {
  name: "小明",
  age: 18,
  sex: 1,
};
function userReducer(state = initialUserState, action) {
  switch (action.type) {
    case "SET_NAME": {
      return {
        ...state,
        name: action.name,
      };
    }
    case "SET_AGE": {
      return {
        ...state,
        age: action.age,
      };
    }
    case "SET_SEX": {
      return {
        ...state,
        sex: action.sex,
      };
    }
    default:
      return state;
  }
}
```

基于`createReducer`简化后的`userReducer`

```javascript
const initialUserState = {
  name: "小明",
  age: 18,
  sex: 1,
};
const userReducer = createReducer(initialUserState, (builder) => {
  builder
    .addCase("SET_NAME", (state, action) => {
      // 无需返回新的对象，直接对state进行操作即可
      state.name = action.payload;
    })
    .addCase("SET_AGE", (state, action) => {
      state.age = action.payload;
    })
    .addCase("SET_SEX", (state, action) => {
      state.sex = action.payload;
    });
});
```

#### 3. createSlice

`createSlice`是由`createAction`和`createReducer`组合而成，更进一步简化模版代码

```javascript
function createSlice({
    // 会添加在action type的前面，[name]/[action type]
    // 例如：user/GET_USER_INFO
    name: string,
    // reducer的初始值
    initialState: any,
    // 在这里通过object（key-value）形式定义你需要的action和reducer
    // key也就是action的名称，只能以string的形式定义
    // value有两种形式：
    // (state, action) => {} //对state进行操作
    // 或者
    // {
    //   reducer: (state, action) => {},
    //   prepare: (...args) => { return { payload: any} }
    // }
    // prepare主要在执行reducer函数前对action传参进行修改
    // 如果不定义prepare，将会默认把第一个参数作为payload传进去
    reducers: Object<string, ReducerFunction | ReducerAndPrepareObject>
    // extraReducers用来捕抓指定的action，并做出相应动作
    // 自身的action无法捕抓
    // 可以自定义捕抓条件
    // 如何定义：
    // 类似与reducers的object（key-value）形式，key定义捕抓的action，value表示捕抓成功后的相应动作
    // 通过builder的addCase、addMatcher、addDefaultCase进行定义
    extraReducers?:
    | Object<string, ReducerFunction>
    | ((builder: ActionReducerMapBuilder<State>) => void)
})
```

#### 4. createAsyncThunk、createEntityAdapter

`createAsyncThunk`是基于`redux-thunk`封装的 api，用来处理异步逻辑，创建出来的`type`有三种状态

🌰 例如定义的 type 为`user/getUserInfo`：

| status    | type                       |
| --------- | -------------------------- |
| pending   | user/getUserInfo/pending   |
| fulfilled | user/getUserInfo/fulfilled |
| rejected  | user/getUserInfo/rejected  |

🌰 实际例子：

```javascript
function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (payload, thunkApi) => {
    await timeout(3000); // 请求接口
    return { name: "小明", sex: 0, age: 24 }; // 返回结果
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState: {
    loadStatus: 0,
    name: '',
    sex: -1,
    age: 0,
  },
  reducers: {
    'getUserInfo/pending': (state) => {
      state.loadStatus === 1
    },
    'getUserInfo/fulfilled': (state, action) => {
      const { name, sex, age } = action.payload;
      state.loadStatus === 2
      state.name = name;
      state.sex = sex as 0 | 1;
      state.age = age;
    },
    'getUserInfo/rejected': (state) => {
      state.loadStatus === 0
    },
  },
  // 这里reducers和extraReducers的作用是等价的
  // 实际运用上推荐使用extraReducers
  // 因为extraReducers有ts支持
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.pending, (state, action) => {
        state.loadStatus === 1
      }).addCase(getUserInfo.fulfilled, (state, action) => {
        const { name, sex, age } = action.payload;
        state.loadStatus === 2
        state.name = name;
        state.sex = sex as 0 | 1;
        state.age = age;
      }).addCase(getUserInfo.rejected, (state, action) => {
        state.loadStatus === 0
      })
  }
})
```

#### 5. 实践 QA
