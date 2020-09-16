### react-router-dom 简单讲解

##### 1.前言

react-router-dom 是基于 history 库开发的 react 路由管理库，这里主要简单讲解 react-router-dom 的 api，理解他们的作用和流程，**而 history 部分将不深入讨论**

react-router-dom 主要有 BrowserRouter、HashRouter、Router、Switch、Route、Link、withRouter 这几个常用 api，而 BrowserRouter、HashRouter 是 react-router-dom 封装 Router 后的 api

其中 BrowserRouter、HashRouter、Link 来自 react-router-dom，其它 api 都来自 react-router，react-router-dom 只是进行了转接而已

分成 react-router-dom 和 react-router，是因为 react-router 不止服务于**web**，还有**native**环境，通用的 api 放在了 react-router，而基于 web 特定的 api 则放在了 react-router-dom

##### 2. 先简单的介绍下这几个 api

- Router：接收 history 实例化后的对象，绑定 history 的监听函数，并通过 context 传递下来
- BrowserRouter |　 HashRouter：分别基于 history 的 createBrowserHistory 和 createHashHistory 封装后的 Router
- Switch：在里面的 Route 会按顺序依次匹配，只会渲染第一个匹配的 Route（除 Route 组件外，未知）
- Route：根据设定的 path 匹配当前的 pathname，判断是否渲染传递的 component 或者 children
- withRouter：一个高阶组件，为组件提供 history 控制 api
