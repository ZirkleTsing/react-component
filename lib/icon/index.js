import React from 'react'
import '@common/style/font/iconfont.css'
import classnames from 'classnames';
import PropTypes from 'prop-types'

export default class extends React.Component {
  static displayName = 'rc-Icon'

  static propTypes = {
    iconType: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func,
    prefixCls: PropTypes.string
  }

  static defaultProps = {
    prefixCls: 'rc-icon'
  }

  render() {
    const { iconType, className, prefixCls, ...rest } = this.props
    const classes = classnames(prefixCls, className, 'iconfont', {
      [`icon-${iconType}`]: iconType
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
