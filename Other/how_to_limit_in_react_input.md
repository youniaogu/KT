### input 限制输入

#### 1. 问题

很多时候需要对 input 进行输入的限制，比如只允许输入数字、英文字母和中文，不允许输入特殊字符，又或者限制长度等

第一次接触的人可能会简单的在`onChange`里`replace`

```javascript
handleInputChange = evt => {
  const { name, value } = evt.target

  this.setState({
    [name]: value.replace(/[^\u4e00-\u9fa50-9a-zA-Z]/g, ""); //除数字、英文字母和中文外都替换为‘’
  })
}

<input name="name" value={name} onChange={this.handleInputChange} />
```

这样写的话，如果涉及到输入法时会出现错误

因为输入法键入是一个过程，而 React 中每次键入都会触发`onChange`，过程中输入法的一些键入被`replace`去除后，就会导致错误的情况

#### 2. 解决方法

[Composition Events](https://developer.mozilla.org/zh-CN/docs/Web/API/CompositionEvent)（组成事件）里面有`onCompositionStart onCompositionUpdate onCompositionEnd`三个事件分别代表 开始输入合成、输入合成更新、输入合成结束

`onCompositionStart`和`onCompositionEnd`与`onChange`的执行顺序有两种情况：

1. 正常情况下：`onCompositionStart` -> `onCompositionEnd` -> `onChange`
2. chrome 或 IOS 版本 10.3 及以后：`onCompositionStart` -> `onChange` -> `onCompositionEnd`

#### 3. 思路

将`formatter`部分单独拿出来，当处在`onCompositionStart`和`onCompositionUpdate`状态时不触发`formatter`

```javascript
import React from "react";

isChrome = () => {
  return !!window.chrome;
};
IOSVer = () => {
  const match = window.navigator.userAgent.match(/\d[\d]*_\d[_\d]*/i);
  if (match) {
    return parseFloat(match[0].split("-").join("."));
  }
  return null;
};

function Input(props) {
  this.onComposition = true;
  this.isChrome = isChrome();
  this.IOSver = IOSVer();

  handleInputChange = evt => {
    const { onChange, formatter } = this.props;

    if (typeof onChange === "function") {
      let value = evt.target.value;
      if (this.onComposition && formatter) {
        value = formatter(value);
      }

      evt.target.value = value;

      onChange(evt);
    }
  };
  const handleComposition = evt => {
    if (evt.type === "compositionend") {
      this.onComposition = true;

      if (this.isChrome || (this.IOSVer && this.IOSVer >= 10.3)) {
        this.handleInputChange(evt);
      }
    } else {
      this.onComposition = false;
    }
  };

  const { children, onChange, formatter, ...otherProps } = props;

  return (
    <input
      {...otherProps}
      onChange={this.handleInputChange}
      onCompositionStart={this.handleComposition}
      onCompositionUpdate={this.handleComposition}
      onCompositionEnd={this.handleComposition}
    />
  );
}

export default Input;
```

注意的点：因为`formatter`部分是在`onChange`里执行，所以第二种情况下`onCompositionEnd`后需要手动触发`onChange`
