import React from 'react'
import PropTypes from 'prop-types';

export default class AnimateChild extends React.Component {
  static displayName = 'rc-AnimateChild'

  static propTypes = {
    children: PropTypes.any
  }

  componentWillAppear = (done) => {
    done()
  }

  componentWillLeave = (done) => {
    done()
  }

  render () {
    return this.props.children
  }
}
