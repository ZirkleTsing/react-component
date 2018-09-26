import React from 'react'

class Child extends React.Component {
  componentWillReceiveProps () {
    console.log('child componentWillReceiveProps')
  }

  componentDidUpdate () {
    console.log('child didUpdate')
  }

  render () {
    return <div>{this.props.name}</div>
  }
}

class Father extends React.Component {
  componentWillReceiveProps () {
    console.log('father componentWillReceiveProps')
  }

  componentDidUpdate () {
    console.log('father didUpdate')
  }

  render () {
    return this.props.children
  }
}

// Note that if a parent component causes your component to re-render,
// this method will be called even if props have not changed.
// Make sure to compare the current and next values if you only want to handle changes.
export default class Demo extends React.Component {
  state = {
    name: ''
  }
  componentWillReceiveProps () {
    console.log('demo componentWillReceiveProps')
  }
  componentDidMount () {
    for (let i = 1; i < 5; i++) {
      setTimeout(() => {
        this.setState({
          name: this.state.name + i
        })
      }, i * 1000)
    }
  }
  componentDidUpdate () {
    console.log('demo didUpdate')
  }
  render () {
    return <Father><Child name={this.state.name}></Child></Father>
  }
}
