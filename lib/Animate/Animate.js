import React from 'react'
import PropTypes from 'prop-types'
import AnimateChild from './AnimateChild'
import { mapChildrenToArray } from '@common/react-children-utils'

const defaultKey = `rc__animate__${Date.now()}`
function getChildFromProps(props) {
  const children = props.children
  if(React.isValidElement(children)) {
    if(!children.key) {
      return React.cloneElement(children, {
        key: defaultKey
      })
    }
  }
  return children
}

function noop() {}

export default class Animate extends React.Component {
  static displayName = 'rc-Animate'

  static propTypes = {
    showProp: PropTypes.string
  }

  static defaultProps = {}

  constructor(props) {
    super(props)
    this.currentAnimatingKeys = {}
    this.keyToEnter = []
    this.keyToLeave = []
    this.childrenRefs = {}
    this.state = {
      children: mapChildrenToArray(getChildFromProps(props))
    }
  }

  componentDidMount() {
    const showProp = this.props.showProp
    let children = this.state.children
    if (showProp) {
      children = children.filter(child => {
        return !!child.props[showProp]
      })
    }
    children.map(child => {
      if(child) {
        if (!child.key) {
          throw new Error('child must have key for <rc-animate> children')
        }
        this.performAppear(child.key)
      }
    })
  }

  performAppear = (key) => {
    if(this.childrenRefs[key]) {
      this.currentAnimatingKeys[key] = true
      this.childrenRefs[key].componentWillAppear(
        this.handleDoneAdding.bind(this, key, 'appear')
      )
    }
  }

  handleDoneAdding = (key, type)  => {
    console.log(key, type)
  }

  render() {
    return (
      <AnimateChild/>
    )
  }
}
