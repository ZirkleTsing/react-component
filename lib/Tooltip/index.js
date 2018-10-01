import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Animate from '@/Animate'
import './style.less'

class TimerCollector {
  timers = []

  addTimer = (timer, style) => {
    this.timers.push({
      style,
      timer
    })
    console.log('this.timers:', this.timers)
  }

  clearTimeout = (style) => {
    this.timers
      .filter(t => {
        console.log('!!', t)
        return t.style === style
      })
      .forEach(t => {
        console.log('??', t)
        clearTimeout(t) // 这里数组要去掉
      })
  }
}

const timerCollector = new TimerCollector()

class PopoverContent extends React.Component {
  render () {
    const { title, style, className } = this.props
    return <div className={className} style={style}>{title}</div>
  }
}

const ENTER = true, LEAVE = false
class Popover extends React.Component {
  static defaultProps = {
    prefixCls: 'rc-tooltip-popover'
  }

  constructor (props) {
    super(props)
    this.state = { isShow: true }
  }

  hideContent = () => {
    this.task = new Promise((resolve) => {
      this.setState({
        isShow: false
      }, resolve)
    })
    return this.task
  }

  render () {
    const { overlayClassName, title, style, placement, prefixCls } = this.props
    const { isShow } = this.state
    const classes = classnames(prefixCls, overlayClassName, {
      [`${prefixCls}-placement-${placement}`]: true
    })
    return (
      <Animate
        transitionName="rc-tooltip-container"
        transitionAppear
        transitionEnter
        transitionLeave
        component='div'
        showProp="isShow"
        // onEnd={(key, isEnter) => {
        //   console.log(isEnter)
        //   if (isEnter === ENTER) {
        //   } else if (isEnter === LEAVE) {
        //     console.log('leave end')
        //   }
        // }}
      >
        <PopoverContent isShow={isShow} title={title} style={style} className={classes} />
      </Animate>
    )
  }
}

const HIDE = 0, BEFORE_SHOW = 1, SHOW = 2, BEFORE_HIDE = 3
class PopupContainer extends React.Component {
  constructor (props) {
    super(props)
    this.el = document.getElementById('tooltip-root')
    if (!this.el) {
      this.el = document.createElement('div')
      this.el.id = 'tooltip-root'
      document.body.appendChild(this.el)
    }
    this.animateState = HIDE;
  }

  componentWillUnmount () {
    document.body.removeChild(this.el)
    // clearTimeout(this.showTimer)
    // clearTimeout(this.hideTimer)
    timerCollector.clearTimeout('show')
    timerCollector.clearTimeout('hide')
  }

  mouseEnter = (keys) => {
    switch (this.animateState) {
      case HIDE:
        timerCollector.clearTimeout('hide')
        /* this.showTimer = */this.showTooltip(keys)
        this.animateState = BEFORE_SHOW
        console.log('BEFORE_SHOW', keys)
        break;
      case BEFORE_SHOW:
        // clearTimeout(this.showTimer);
        timerCollector.clearTimeout('show')
        /* this.showTimer = */this.showTooltip(keys)
        break
      case SHOW:
        break
      case BEFORE_HIDE:
        // clearTimeout(this.hideTimer);
        timerCollector.clearTimeout('hide')
        this.animateState = SHOW
        console.log('SHOW', keys)
        break
    }
  };

  mouseLeave = (keys) => {
    switch (this.animateState) {
      case HIDE:
        break;
      case BEFORE_SHOW:
        // clearTimeout(this.showTimer)
        timerCollector.clearTimeout('show')
        this.animateState = HIDE
        console.log('HIDE', keys)
        break
      case SHOW:
        this.hideTimer = this.hideTooltip(keys)
        this.animateState = BEFORE_HIDE
        console.log('BEFORE_HIDE', keys)
        break
      // case BEFORE_HIDE:
      //   clearTimeout(this.hideTimer)
      //   this.hideTimer = this.hideTooltip(keys)
      //   break
    }
  };

  showTooltip = (keys) => {
    const { mouseEnterDelay } = this.props
    const targetComp = (
      <Popover {...this.props} ></Popover>
    )
    ReactDOM.unmountComponentAtNode(this.el) // 删除节点的时候 hideTooltip中
    const timer = setTimeout(() => {
      this.targetComp = ReactDOM.render(targetComp, this.el)
      this.animateState = SHOW
      console.log('SHOW', keys)
    }, mouseEnterDelay * 1000)
    timerCollector.addTimer(timer, 'show')
  }

  hideTooltip = (keys) => {
    const { mouseLeaveDelay } = this.props
    const timer = setTimeout(() => {
      this.targetComp.hideContent().then(() => { // 有毒  // 全局收集container
        const hacktimer = setTimeout(() => { // wtf?
          ReactDOM.unmountComponentAtNode(this.el)
        }, 200) // is hack -- relate to animate duration
        timerCollector.addTimer(hacktimer, 'hide')
        this.animateState = HIDE
        console.log('HIDE', keys)
      })
    }, mouseLeaveDelay * 1000)
    timerCollector.addTimer(timer, 'hide')
    return timer
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
    this.container.mouseEnter(this.props.keys)
  }

  mouseLeave = () => {
    this.container.mouseLeave(this.props.keys)
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
