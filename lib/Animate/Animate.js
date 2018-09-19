import React from 'react'
import PropTypes from 'prop-types'
import AnimateChild from './AnimateChild'
import {
  mapChildrenToArray,
  findChildInChildrenByKey,
  findShownChildInChildrenByKey
} from '@common/react-children-utils'
import animUtil from './utils'

const defaultKey = `rc__animate__${Date.now()}`

function getChildFromProps (props) {
  const children = props.children
  if (React.isValidElement(children)) {
    if (!children.key) {
      return React.cloneElement(children, {
        key: defaultKey
      })
    }
  }
  return children
}

function noop () { }

export default class Animate extends React.Component {
  static displayName = 'rc-Animate'

  static propTypes = {
    component: PropTypes.any,
    componentProps: PropTypes.object,
    showProp: PropTypes.string,
    animation: PropTypes.object,
    transitionName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    transitionEnter: PropTypes.bool,
    transitionAppear: PropTypes.bool,
    transitionLeave: PropTypes.bool,
    onEnd: PropTypes.func,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    onAppear: PropTypes.func
  }

  static defaultProps = {
    component: 'span',
    componentProps: {},
    animation: {},
    onEnd: noop,
    onEnter: noop,
    onLeave: noop,
    onAppear: noop,
    transitionEnter: true,
    transitionLeave: true,
    transitionAppear: false
  }

  constructor (props) {
    super(props)
    this.currentAnimatingKeys = {}
    this.keyToEnter = []
    this.keyToLeave = []
    this.childrenRefs = {}
    this.state = {
      children: mapChildrenToArray(getChildFromProps(props))
    }
  }

  componentDidMount () {
    const showProp = this.props.showProp
    let children = this.state.children
    if (showProp) {
      children = children.filter(child => {
        return !!child.props[showProp]
      })
    }
    children.map(child => {
      if (child) {
        if (!child.key) {
          throw new Error('child must have key for <rc-animate> children')
        }
        this.performAppear(child.key)
      }
    })
  }

  performAppear = (key) => {
    if (this.childrenRefs[key]) {
      this.currentAnimatingKeys[key] = true
      this.childrenRefs[key].componentWillAppear(
        this.handleDoneAdding.bind(this, key, 'appear') // curry function
      )
    }
  }

  performLeave = (key) => {
    if (this.childrenRefs[key]) {
      this.currentAnimatingKeys[key] = true
      this.childrenRefs[key].componentWillLeave(
        this.handleDoneLeaving.bind(this, key)
      )
    }
  }

  handleDoneAdding = (key, type) => {
    const props = this.props
    delete this.currentAnimatingKeys[key]

    // componentWillReceiveProps change the children, now state.children may not the right things
    const currentChildren = mapChildrenToArray(getChildFromProps(props))
    if (!this.isValidChildByKey(currentChildren, key)) {
      this.performLeave(key)
    } else {
      if (type === 'appear') {
        if (animUtil.allowAppearCallback(props)) {
          props.onAppear(key)
          props.onEnd(key, true)
        } else {
          if (animUtil.allowEnterCallback(props)) {
            props.onEnter(key);
            props.onEnd(key, true);
          }
        }
      }
    }
  }

  handleDoneLeaving = (key) => { }

  isValidChildByKey = (currentChildren, key) => {
    const showProp = this.props.showProp
    if (showProp) {
      return findShownChildInChildrenByKey(currentChildren, key, showProp)
    }
    return findChildInChildrenByKey(currentChildren, key)
  }

  render () {
    const props = this.props
    const stateChildren = this.state.children
    let children = null
    if (stateChildren) {
      children = stateChildren.map(child => {
        if (child === null || child === undefined) {
          return child
        }
        if (!child.key) {
          throw new Error('must set key for <rc-animate> children')
        }
        return (
          <AnimateChild
            key={child.key}
            ref={node => { this.childrenRefs[child.key] = node }}
            animation={props.animation}
            transitionName={props.transitionName}
            transitionEnter={props.transitionEnter}
            transitionAppear={props.transitionAppear}
            transitionLeave={props.transitionLeave}
          >
            {child}
          </AnimateChild>
        )
      })
    }
    const Component = props.component;
    if (Component) {
      let passedProps = props;
      if (typeof Component === 'string') {
        passedProps = {
          className: props.className,
          style: props.style,
          ...props.componentProps
        };
      }
      return <Component {...passedProps}>{children}</Component>;
    }
    // else only render one child
    return children[0] || null
  }
}
