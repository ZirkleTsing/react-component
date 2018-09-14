import React from 'react'
import '@common/style/font/iconfont.css'
import classnames from 'classnames';
import PropTypes from 'prop-types'

export default class extends React.Component {

  static propTypes = {
    type: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    prefixCls: PropTypes.string
  }

  static defaultProps = {
    prefixCls: 'rc-icon'
  }

  render() {
    const { type, className, prefixCls, ...rest } = this.props
    const classes = classnames(prefixCls, className, 'iconfont', {
      [`icon-${type}`]: type
    })

    return (
      <i
        {...rest}
        className={classes}
      >
      </i>
    )
  }
}
