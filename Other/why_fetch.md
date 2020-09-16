### 为什么用 fetch？

下面罗列了网上经常讨论，关于 fetch 的缺点，以及目前的解决方案

##### 1. 没有自动 stringify

封装抽象方法，很简单

##### 2. 接口抛出 4xx、5xx 类错误会归到成功里，只有网络错误才会抛出 reject

400 ≤ status < 600 情况下，可以在 then 里通过 res.ok 判断是否为错误情况，在根据 status 进行处理，而网络请求错误则在 catch 里处理

##### 3. 缺少默认配置

需要自己封装默认的`headers`或`credentials`，不能开箱即用

##### 4. 兼容性

IE 不兼容

在 fetch 刚出的时候很多人吐槽它的兼容性，但到 2020 年，[caniuse](https://caniuse.com/#search=fetch)上显示全球浏览器兼容性覆盖率达到了 95.11%，可以放心使用

如果需要兼容 IE，可以考虑使用[whatwg-fetch](https://github.com/github/fetch)，这是个 polyfill 库，原理是使用 XMLHttpRequest 来模拟 fetch

##### 5. 请求超时、取消请求

可以使用[AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController/AbortController)实现相关功能

##### 6. 下载进度

可以使用[ReadableStream](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)实现相关功能

##### 7. 上传进度

暂无解决方案

#### 优点

1. 语法上比较简单简洁
2. 基于浏览器提供的原生方法，使用`promise`实现
3. 属于原生 js 系列，不需要引入第三方库
4. 属于底层 api，能够自行封装和控制

#### 对比 axios

axios 是应用于 web 和 node 的 http 请求第三方库，使用`promise`，web 基于`XMLHttpRequest`实现，node 基于`http`模块实现

axios 功能十分强大，基本上 fetch 能做到的 axios 都能做到，甚至能做 fetch 做不到的事情，并且 api 简单，在兼容性方面，axios 最低兼容至 ie11

可以说 axios 是全面碾压 fetch，那么还有什么理由坚持 fetch 呢？请继续往下看

#### 为什么坚持 fetch

1. fetch 作为底层 api，目前除了上传进度无解以外，其他都有对应的处理方法，只要抽象封装后完全能够应对大部分的场景

2. 高度封装的库确实能够很方便的满足需求，但这中间封装的过程和原理却无从得知，会用仅仅是达到 20%而已

3. 大部分情况下，http 请求并不需要特别复杂的功能，不需要引入额外库的 fetch 会是更好的选择

4. 自己封装底层 api，能够更贴合实际业务中的需求，更加的理解里面的流程，出问题时能够更好的解决
