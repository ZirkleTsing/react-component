import React from 'react'

export default class AnimateChild extends React.Component {
  static displayName = 'rc-AnimateChild'

  componentWillAppear = (done) => { done() }
  componentWillLeave = (done) => { done() }
  render() {
    return <div>AnimateChild</div>
  }
}
