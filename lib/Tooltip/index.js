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

const HIDE = 0, BEFORE_SHOW = 1, SHOW = 2, BEFORE_HIDE = 3
class PopupContainer extends React.Component {
  constructor (props) {
    super(props)
    this.rootSeed = Date.now()
    this.el = document.getElementById(`tooltip-root-${this.rootSeed}`)
    if (!this.el) {
      this.el = document.createElement('div')
      this.el.id = `tooltip-root-${this.rootSeed}`
      document.body.appendChild(this.el)
    }
    this.animateState = HIDE;
  }

  componentWillUnmount () {
    document.body.removeChild(this.el)
    clearTimeout(this.showTimer)
    clearTimeout(this.hideTimer)
  }

  mouseEnter = () => {
    switch (this.animateState) {
      case HIDE:
        this.showTimer = this.showTooltip()
        this.animateState = BEFORE_SHOW
        break;
      case BEFORE_SHOW:
        clearTimeout(this.showTimer);
        this.showTimer = this.showTooltip()
        break
      case SHOW:
        break
      case BEFORE_HIDE:
        clearTimeout(this.hideTimer);
        this.animateState = SHOW
        break
    }
  };

  mouseLeave = () => {
    switch (this.animateState) {
      case HIDE:
        break;
      case BEFORE_SHOW:
        clearTimeout(this.showTimer)
        this.animateState = HIDE
        break
      case SHOW:
        this.hideTimer = this.hideTooltip()
        this.animateState = BEFORE_HIDE
        break
      case BEFORE_HIDE:
        clearTimeout(this.hideTimer)
        this.hideTimer = this.hideTooltip()
        break
    }
  };

  showTooltip = () => {
    const { mouseEnterDelay } = this.props
    // ReactDOM.unmountComponentAtNode(this.el)
    return setTimeout(() => {
      ReactDOM.render(<Popover {...this.props} />, this.el)
      this.animateState = SHOW
    }, mouseEnterDelay * 1000)
  }

  hideTooltip = () => {
    const { mouseLeaveDelay } = this.props
    return setTimeout(() => {
      ReactDOM.unmountComponentAtNode(this.el)
      this.animateState = HIDE
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
    mouseLeaveDelay: 0.1
  }
  mouseEnter = () => {
    this.container.mouseEnter()
  }

  mouseLeave = () => {
    this.container.mouseLeave()
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
            onMouseEnter: this.mouseEnter,
            onMouseLeave: this.mouseLeave
          })
        }
      </PopupContainer>
    )
  }
}

export default Tooltip
