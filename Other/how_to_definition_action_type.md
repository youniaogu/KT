### 如何定义 Action type

在写 redux 时，需要定义 action type，往往我们会直接写成字符串，而有些情况则会写成变量再传递过去

那么定义为变量有什么好处和坏处？

##### 1. 好处：能够很好定位拼写错误

```javascript
// actions.js
const LOAD_USER_LIST = "LOAD_USER_LIST";
const LOAD_USER_INFO = "LOAD_USER_INFO";

// userList.js
import {LOAD_USER_LIST, LOAD_USER_DETAIL} from './actions'；
// Attempted import error: 'LOAD_USER_DETAIL' is not exported from './action'
// 这里会提示报错，LOAD_USER_DETAIL不存在
```

当引入不存在的`action`变量时应用会编译失败，能够很好的提示我们

```javascript
export function loadUserInfo(id) {
  return {
    type: "LOAD_USER_DETAIL", //正确应该是type: "LOAD_USER_INFO",
    id
  };
}
```

当`action`为字符串时，并不会提示报错，但对应的`reducer`与`saga`部分不会运行，而往往为了找出这种低级错误，会浪费很多时间

##### 2. 坏处：使用时会麻烦一些，需要引入`action`

```javascript
// sagas.js | createAction.js | reducers.js
import { LOAD_USER_LIST, LOAD_USER_INFO } from "./actions.js";
```

##### 3. 思考

大项目逻辑复杂查错不易，`action`定义为变量更为严谨，可以规避一些低级错误

小项目要求快速开发，`action`定义为字符串更为直接，能够加快开发效率

很多时候，我们不能一味的模范，而是要思考为什么要这样做，其中的利与弊是什么，适合自己的才是最好的
