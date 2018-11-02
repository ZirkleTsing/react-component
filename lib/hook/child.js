import React from 'react'
import { connect } from 'tls';

export default class Demo extends React.Component {
  state = {}
  componentWillReceiveProps () {
    console.log('child componentWillReceiveProps')
  }
  shouldComponentUpdate () {
    console.log('child shouldComponentUpdate')
    return true
  }
  render () {
    console.log('child render')
    return <div onClick={() => { this.setState({ b: this.state.b + 1 }) }}>123</div>
  }
  componentDidUpdate () {
    console.log('child componentDidUpdate')
  }
}

// Child如果是Component,不管root组件给child注没注入props，或者注入的props发没发生变化，都会走如下周期：
// root shouldComponentUpdate
// root render
// child componentWillReceiveProps
// child shouldComponentUpdate
// child render
// child componentDidUpdate
// root componentDidUpdate

// 我们发现当child与root毫无关系的时候(没有props注入) root setState更新 会使得child进入ComponentWillReceiveProps周期

// 而使用pureComponent后，除非root组件给child注入了相关的props变化了，子组件才会update，但是依旧会ComponentWillReceiveProps

// 若root组件给child注入了无关的state(注入的state没有变化，PureComponent会走如下周期)
// root shouldComponentUpdate
// root render
// child componentWillReceiveProps
// child shouldComponentWillUpdate 阻断
// root componentDidUpdate

// 若root组件给child注入了相关的state(注入的state发生变化，PureComponent会走如下周期)
// root shouldComponentUpdate
// root render
// child componentWillReceiveProps
// child shouldComponentWillUpdate 前后不一样，没有阻断
// child render
// child componentDidUpdate
// root componentDidUpdate

// 思考下Component,pureComponent的使用场景 render => diff => dom 或许能减少diff?

// 对于Redux来说 connect()(Component)实际上返回了一个Component的高阶组件，
// 通过dispatch发布订阅模式，会自动setState这个高阶组建的状态，这就会导致只要dispatch，就会执行setState，
// 也就会在当前回调或hook结束后进行batch执行state的生命周期流程: shouldComponentUpdate componentWillUpdate render diff

// 若在componentWillMount中setState时，不会像ComponentDidMount钩子中执行SetState那样，延迟batch批量去处理state(shouldComponentUpdate componentWillUpdate render diff),
// 从观察的现象上看ComponentWillMount钩子里不会立刻更新state,此时打印state没变
// 而是在钩子执行完毕后，render函数之前，类似于state.b =2 这种直接赋值的操作来更新state，不会走额外的生命周期，
// 所以官方推荐在constructor中进行初始化state的工作：
// 我觉着实现思路大概如下 componentWillMount阶段setState收集state提交报告，
// willMount结束后，检查队列queue是否为空，不为空直接state[key] = item[key] 而不是走shouldComponent => ... 这些流程
// UNSAFE_componentWillMount() is invoked just before mounting occurs.
// It is called before render(), therefore calling setState() synchronously in this method will not trigger an extra rendering.
//  Generally, we recommend using the constructor() instead for initializing state.

// 在非React控制的事件订阅中，setState({})在函数执行的时候就会立刻去shouldCompoentUpdate => ... => render，
// 然后在执行事件函数的后半部分,这是后已经更新了State，也就是说 非React管辖的事件中setState会频繁render，
// 这时候this.state可以看做是被同步更新了（willUpdate之后render之前，也不是严格意义上的同步，因为WillUpdate中没有更新）
// 而不像React管辖的回调函数setState，回调函数执行完毕后合并SetState 优化render次数

// class App extends React.Component {
//   constructor() {
//     super(...arguments);

//     this.onClick = this.onClick.bind(this);
//     this.onClickLater = this.onClickLater.bind(this);

//     this.state = {
//       count: 0
//     };
//   }

//   onClick() {
//     this.setState({count: this.state.count + 1});
//     this.setState({count: this.state.count + 1});
//     console.log('# this.state', this.state);
//   }

//   onClickLater() {
//     setTimeout(() => {
//       this.onClick();
//       this.onClick();
//     });
//   }

//   componentDidMount() {
//     document.querySelector('#btn-raw').addEventListener('click', this.onClick);
//   }

//   render() {
//     console.log('#enter render');
//     return (
//       <div>
//         <div>{this.state.count}
//           <button onClick={this.onClick}>Increment</button>
//           <button id="btn-raw">Increment Raw</button>
//           <button onClick={this.onClickLater}>Increment Later</button>
//         </div>
//       </div>
//     )
//   }
// }

// ReactDOM.render(<App />, document.querySelector('#container'));
