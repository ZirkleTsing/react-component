import React from 'react'

export default class AnimateChild extends React.Component {
  static displayName = 'rc-AnimateChild'

  componentWillAppear = (done) => { }
  componentWillLeave = (done) => { }
  render() {
    return <div>AnimateChild</div>
  }
}
