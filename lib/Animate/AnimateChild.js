import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import cssAnimate, { isCssAnimationSupported } from 'css-animation'
import animUtil from './utils'

const transitionMap = {
  enter: 'transitionEnter',
  appear: 'transitionAppear',
  leave: 'transitionLeave'
};

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
    const node = ReactDOM.findDOMNode(this)
    // https://reactjs.org/docs/react-dom.html#finddomnode
    // If this component has been mounted into the DOM, this returns the corresponding native browser DOM element
    const props = this.props
    const transitionName = props.transitionName
    const nameIsObj = typeof transitionName === 'object'
    this.stop()
    const end = () => {
      this.stopper = null
      finishCallback()
    }
    if (
      (isCssAnimationSupported || !props.animation[animationType]) && // 支持animation属性，并没有第三方库的支持
       transitionName &&
       props[transitionMap[animationType]]) {
      const name = nameIsObj ? transitionName[animationType] : `${transitionName}-${animationType}`
      const activeName = (nameIsObj && transitionName[`${animationType}Active`]) ? transitionName[`${animationType}Active`] : `${name}-active`
      this.stopper = cssAnimate(node, {
        name,
        active: activeName
      }, end)
    } else {
      this.stopper = props.animation[animationType](node, end)
    }
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
