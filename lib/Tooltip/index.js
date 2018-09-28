import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Animate from '@/Animate'
import './style.less'

class Popover extends React.Component {
  static defaultProps = {
    prefixCls: 'rc-tooltip-popover'
  }
  render () {
    const { overlayClassName, title, style, placement, prefixCls } = this.props
    const classes = classnames(prefixCls, overlayClassName, {
      [`${prefixCls}-placement-${placement}`]: true
    })
    return (
      <Animate
        transitionName="rc-tooltip-container"
        transitionAppear
        transitionEnter
        transitionLeave
        component=''
      >
        <div style={style} className={classes}>
          {title}
        </div>
      </Animate>
    )
  }
}

class PopupContainer extends React.Component {
  constructor (props) {
    super(props)
    this.el = document.getElementById('tooltip-root')
    if (!this.el) {
      this.el = document.createElement('div')
      this.el.id = 'tooltip-root'
      document.body.appendChild(this.el)
    }
  }

  componentWillUnmount () {
    document.body.removeChild(this.el)
    clearTimeout(this.showTimer)
    clearTimeout(this.hideTimer)
  }

  showTooltip = () => {
    const { mouseEnterDelay } = this.props
    clearTimeout(this.hideTimer)
    ReactDOM.unmountComponentAtNode(this.el)
    this.showTimer = setTimeout(() => {
      ReactDOM.render(<Popover {...this.props} />, this.el)
    }, mouseEnterDelay * 1000)
  }

  hideTooltip = () => {
    const { mouseLeaveDelay } = this.props
    clearTimeout(this.showTimer)
    this.hideTimer = setTimeout(() => {
      ReactDOM.unmountComponentAtNode(this.el)
    }, mouseLeaveDelay * 1000)
  }

  render () {
    return this.props.children
  }
}

class Tooltip extends React.Component {
  static displayName = 'rc-Tooltip'

  static propTypes = {
    overlayClassName: PropTypes.string, // 卡片类名
    overlayStyle: PropTypes.object, // 卡片样式
    placement: PropTypes.oneOf(['top', 'left', 'right', 'bottom']), // 气泡框位置，可选 top left right bottom
    mouseEnterDelay: PropTypes.number, // 鼠标移入后延时多少才显示 Tooltip，单位：秒
    mouseLeaveDelay: PropTypes.number // 鼠标移出后延时多少才隐藏 Tooltip，单位：秒
  }

  static defaultProps = {
    overlayStyle: {},
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 100000
  }
  showTooltip = () => {
    this.container.showTooltip()
  }

  hideTooltip = () => {
    this.container.hideTooltip()
  }

  generateDelayStyle = () => {
    const { mouseEnterDelay, mouseLeaveDelay } = this.props
    return {
    }
  }

  render () {
    return (
      <PopupContainer { ...this.props } ref={ctx => { this.container = ctx }}>
        {
          React.cloneElement(this.props.children, {
            onMouseEnter: this.showTooltip,
            onMouseLeave: this.hideTooltip
          })
        }
      </PopupContainer>
    )
  }
}

export default Tooltip
