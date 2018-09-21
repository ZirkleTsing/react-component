import React from 'react'
import PropTypes from 'prop-types'
import AnimateChild from './AnimateChild'
import {
  mapChildrenToArray,
  findChildInChildrenByKey,
  findShownChildInChildrenByKey,
  mergeChildren,
  isSameChildren
} from '@common/react-children-utils'
import animUtil from './utils'

const defaultKey = `rc__animate__${Date.now()}`

function getChildrenFromProps (props) {
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
    onAppear: PropTypes.func,
    children: PropTypes.node
  }

  static defaultProps = {
    animation: {},
    component: 'span',
    componentProps: {},
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
    this.keyToEnter = [] // save components that will enter at the didUpdate hook; see the lifecycle in React to learn detail
    this.keyToLeave = []
    this.childrenRefs = {} // collect the AnimateChild object
    this.state = {
      children: mapChildrenToArray(getChildrenFromProps(props))
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

  componentWillReceiveProps (nextProps) {
    const nextChildren = mapChildrenToArray(getChildrenFromProps(nextProps))
    const props = this.props
    const { showProp } = props
    const currentAnimatingKeys = this.currentAnimatingKeys

    const currentChildren = this.state.children
    let newChildren = []

    if (showProp) {
      currentChildren.map(currentChild => {
        const nextChild = currentChild && findShownChildInChildrenByKey(nextChildren, currentChild.key, showProp)
        let newChild = null
        if ((!nextChild || !nextChild.props[showProp]) && currentChild.props[showProp]) {
          newChild = React.cloneElement((nextChild || currentChild), {
            [showProp]: true
          })
        } else {
          newChild = currentChild
        }
        if (newChild) {
          newChildren.push(newChild)
        }
      })
      nextChildren.forEach(nextChild => { // new adding element
        if (nextChild && !findChildInChildrenByKey(currentChildren, nextChild.key)) {
          newChildren.push(nextChild)
        }
      })
    } else {
      // 暂时不考虑这个情况 mergeChildren
    }

    // to prevent from updating render twice, so setState in componentWillReceiveProps
    this.setState({
      children: newChildren
    })

    nextChildren.forEach(child => {
      const key = child && child.key
      if (child && currentAnimatingKeys[key]) {
        return void 0
      }
      const hasPrev = child && findChildInChildrenByKey(currentChildren, key)
      if (showProp) {
        const showInNext = child.props[showProp]
        if (hasPrev) {
          const showInNow = findShownChildInChildrenByKey(currentChildren, key, showProp)
          if (!showInNow && showInNext) {
            this.keyToEnter.push(key)
          }
        } else if (showInNext) {
          this.keyToEnter.push(key)
        }
      } else if (!hasPrev) {
        this.keyToEnter.push(key)
      }
    })

    currentChildren.forEach(child => {
      const key = child && child.key
      if (child && currentAnimatingKeys[key]) {
        return void 0
      }
      const hasNext = child && findChildInChildrenByKey(nextChildren, key)
      if (showProp) {
        const showInNow = child.props[showProp]
        if (hasNext) {
          const showInNext = findShownChildInChildrenByKey(nextChildren, key, showProp)
          if (showInNow && !showInNext) {
            this.keyToLeave.push(key)
          }
        } else if (showInNow) {
          this.keyToLeave.push(key)
        }
      } else if (!hasNext) {
        this.keyToLeave.push(key)
      }
    })
  }

  componentDidUpdate () {
    const keyToEnter = this.keyToEnter
    this.keyToEnter = []
    keyToEnter.map(this.performEnter)
    const keyToLeave = this.keyToLeave
    this.keyToLeave = []
    keyToLeave.map(this.performLeave)
  }

  performAppear = (key) => {
    if (this.childrenRefs[key]) {
      this.currentAnimatingKeys[key] = true
      this.childrenRefs[key].componentWillAppear(
        this.handleDoneAdding.bind(this, key, 'appear') // curry function
      )
    }
  }

  performEnter = (key) => {
    if (this.childrenRefs[key]) {
      this.currentlyAnimatingKeys[key] = true;
      this.childrenRefs[key].componentWillEnter(
        this.handleDoneAdding.bind(this, key, 'enter')
      );
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

    // componentWillReceiveProps change the children, now state.children may not the right things,
    // so considerate this animation process is async, we should to make sure that we add the right components.
    const currentChildren = mapChildrenToArray(getChildrenFromProps(props))
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

  handleDoneLeaving = (key) => {
    const props = this.props
    delete this.currentAnimatingKeys[key]

    const currentChildren = mapChildrenToArray(getChildrenFromProps(props))
    // componentWillReceiveProps change the children, now state.children may not the right things,
    // so considerate this animation process is async, we should to make sure that we add the right components.
    if (this.isValidChildByKey(currentChildren, key)) {
      this.performEnter(key)
    } else {
      if (!isSameChildren(currentChildren, this.state.children, props.showProp)) {
        this.setState({
          children: currentChildren
        }, this.endCallback)
        // beacuse in componentWillReceive we use
        // this.setState to add all currentChild and nextProps [showProps]: true
        // now we should make the this.state.children right.
      } else {
        this.endCallback()
      }
    }
  }

  endCallback = (props, key) => {
    if (animUtil.allowLeaveCallback(props)) {
      props.onLeave(key)
      props.onEnd(key, false)
    }
  }

  isValidChildByKey = (currentChildren, key) => {
    const showProp = this.props.showProp
    if (showProp) {
      return findShownChildInChildrenByKey(currentChildren, key, showProp)
    }
    return findChildInChildrenByKey(currentChildren, key)
  }

  stop = (key) => {
    delete this.currentAnimatingKeys[key]
    const component = this.childrenRefs[key]
    if (component) {
      component.stop()
    }
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
