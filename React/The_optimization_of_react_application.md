### React 应用优化

#### 使用 evt.target.dataset 代替工厂函数

尽量避免例子一，改用例子二的写法

##### 例子一：

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

##### 例子二：

    handleClick = evt => {
      console.log(evt.target.dataset.index)
    }

    {
      list.map((obj, index) => {
        return <div data-index={index} key={index} onClick={this.handleClick}>index</div>
      })
    }
