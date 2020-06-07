## Css

### 一、什么时候会发生 margin 合并，怎么避免?

例如：

    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

### 二、sticky（粘性）定位

sticky 在与 flex 一起使用时会失效(原因是 flex 在副轴上默认是 stretch，将副轴长度拉满，所以 sticky 会无效)，需要添加 align-items:flex-start。(来源：<a href="https://stackoverflow.com/questions/44446671/my-position-sticky-element-isnt-sticky-when-using-flexbox">stackoverflow</a>)
