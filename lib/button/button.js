import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import omit from 'omit.js'
import './style/button.less'
import Icon from '@/icon'

export default class Button extends React.Component {

  static propTypes = {
    type: PropTypes.oneOf(['default', 'primary', 'dashed', 'danger']),
    size: PropTypes.oneOf(['small', 'default', 'large']),
    loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    ghost: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),
    href: PropTypes.string,
    icon: PropTypes.string
  }

  static defaultProps = {
    prefixCls: 'rc-btn',
    loading: false,
    ghost: false,
    size: 'default',
    type: 'default'
  }

  constructor(props) {
    super(props)
    this.state = {
      loading: props.loading,
      clicked: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentLoading = this.props.loading
    const comingLoading = nextProps.loading
    if (currentLoading) {
      clearTimeout(this.delayTimeout)
    }
    if (typeof loading !== 'boolean' && loading && loading.delay) {
      this.delayTimeout = window.setTimeout(() => this.setState({ loading }), loading.delay)
    } else {
      this.setState({
        loading
      })
    }
  }

  componentWillUnmount() {
    clearTimeout(this.delayTimeout)
    clearTimeout(this.clickTimeout)
  }

  handleClick = e => {
    this.setState({
      clicked: true
    })
    clearTimeout(this.clickTimeout)
    setTimeout(() => this.setState({ clicked: false }), 400)
    const { onClick } = this.props
    if (onClick) {
      onClick(e)
    }

  }

  render() {
    const { type, size, className, htmlType, children, prefixCls, ghost, icon, ...rest } = this.props
    const { loading, clicked } = this.state

    let sizeCls = ''
    switch(size) {
      case 'large':
        sizeCls = 'lg'
        break
      case 'small':
        sizeCls = 'sm'
        break
      default:
        sizeCls = 'nm'
    }

    const CompomentProp = rest.href ? 'a' : 'button'

    const classes = classNames(prefixCls, className, {
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${sizeCls}`]: sizeCls,
      [`${prefixCls}-${loading}`]: loading,
      [`${prefixCls}-clicked`]: clicked
    })

    const iconType = loading ? 'loading' : icon
    const iconNode = iconType ? <Icon iconType={iconType}></Icon> : null

    return (
      <CompomentProp
        {...omit(rest, ['loading'])}
        type={rest.href ? undefined : (htmlType || 'button')}
        className={classes}
        onClick={this.handleClick}
      >
        {iconNode}{children}
      </CompomentProp>
    )
  }
}
