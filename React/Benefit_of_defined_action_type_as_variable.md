### 将 Action 定义为变量的好处

例如：
actions.js

    const LOAD_USER_LIST = "LOAD_USER_LIST";
    const LOAD_USER_INFO = "LOAD_USER_INFO";

userList.js

    import {LOAD_USER_LIST, LOAD_USER_INFO} from 'actions.js'

当我们引入 action 时如果有拼写错误，会拿到 undefined，在触发 action 时 redux 会报错。相比与直接写 string，变量更容易定位错误。

**题外话：**  
建议**大项目**使用**变量**的写法  
**小项目**直接写 string，甚至将 dispatch 与 action 合并（直接调用 action，跳过 connect），提高开发效率

    import store from "~R/store";

    function loadUserList () {
      return store.dispatch({
        type: 'LOAD_USER_LIST',
      });
    }
