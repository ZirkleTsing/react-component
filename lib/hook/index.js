import React from 'react'
import Child from './child'

export default class Demo extends React.Component {
  state = {}
  componentWillReceiveProps () {
    console.log('root componentWillReceiveProps')
  }
  shouldComponentUpdate () {
    console.log('root shouldComponentUpdate')
    return true
  }
  render () {
    console.log('root render')
    return (
      <div>
        <div onClick={() => { this.setState({ a: this.state.a + 1 }) }}>root</div>
        <Child></Child>
      </div>
    )
  }
  componentDidUpdate () {
    console.log('root componentDidUpdate')
  }
}
