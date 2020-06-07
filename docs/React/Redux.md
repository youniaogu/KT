## React/Redux

### 一、redux-thunk 有什么用，为什么要用?

### 二、redux-saga 有什么用，和 redux-thunk 有什么区别?

### 三、将 action type 定义为变量的好处

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

### 十、react 里绑定事件时请使用 evt.target.dataset 代替工厂函数

尽量避免例子一，改用例子二的写法

#### 例子一：

    handleClick = (index) => {
      return () => {
        console.log(index)
      }
    }

    {
      list.map((obj, index) => {
        return <div key={index} onClick={this.handleClick(index)}>index</div>
      })
    }

#### 例子二：

    handleClick = evt => {
      console.log(evt.target.dataset.index)
    }

    {
      list.map((obj, index) => {
        return <div data-index={index} key={index} onClick={this.handleClick}>index</div>
      })
    }
