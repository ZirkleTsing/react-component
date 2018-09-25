import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import animUtil from './utils'

export default class AnimateChild extends React.Component {
  static displayName = 'rc-AnimateChild'

  static propTypes = {
    children: PropTypes.any
  }

  componentWillUnmount () {
    this.stop()
  }

  componentWillAppear = (done) => {
    if (animUtil.isAppearSupported(this.props)) {
      this.transition('appear', done)
    } else {
      done()
    }
  }

  componentWillEnter = (done) => {
    if (animUtil.isEnterSupported(this.props)) {
      this.transition('enter', done)
    } else {
      done()
    }
  }

  componentWillLeave = (done) => {
    if (animUtil.isLeaveSupported(this.props)) {
      this.transition('leave', done) // curry function bind in father component
    } else {
      done()
    }
  }

  transition = (animationType, finishCallback) => {
    const node = ReactDOM.findDOMNode(this) // https://reactjs.org/docs/react-dom.html#finddomnode
  }

  stop = () => {
    const stopper = this.stopper
    if (stopper) {
      this.stopper = null
      stopper.stop()
    }
  }

  render () {
    return this.props.children
  }
}
