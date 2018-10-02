import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import Animate from '@/Animate'
import {
  getElementRelativeLeft,
  getElementRelativeTop,
  getElementRelativeBottom,
  getElementRelativeRight } from '@common/dom-utils'
import './style.less'

const posMap = {
  top: ['left', 'top'],
  left: ['left', 'top'],
  right: ['right, top'],
  bottom: ['bottom', 'left']
}
class Popover extends React.Component {
  static defaultProps = {
    prefixCls: 'rc-tooltip-popover'
  }

  render () {
    const { overlayClassName, title, style, placement, prefixCls, onMouseEnter, onMouseLeave, pos } = this.props
    const classes = classnames(prefixCls, overlayClassName, {
      [`${prefixCls}-placement-${placement}`]: true
    })
    const directionCfg = posMap[placement || 'top'] // TODO
    const dirStyle = directionCfg.reduce((ret, dir) => {
      return {
        ...ret,
        [dir]: pos[dir]
      }
    }, {})
    console.log({ ...style, ...dirStyle })
    return (
      <Animate
        transitionName="rc-tooltip-container"
        transitionAppear
        transitionEnter
        transitionLeave
        component=''
      >
        <div
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{ ...style, ...dirStyle }}
          className={classes}
        >
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
    this.rootUniqueId = `tooltip-root-${this.rootSeed}`
    this.rootCommonClass = 'tooltip-root'
    // this.el = document.getElementById(`tooltip-root-${this.rootSeed}`)
    this.animateState = HIDE
  }

  getElementPosition = (dom) => {
    return {
      top: getElementRelativeTop(dom),
      left: getElementRelativeLeft(dom),
      bottom: getElementRelativeBottom(dom),
      right: getElementRelativeRight(dom)
    }
  }

  componentDidMount () {
    const dom = ReactDOM.findDOMNode(this)
    this.containerPostion = this.getElementPosition(dom)
  }

  calcContainerBottomRetiveHeight = () => {

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
        break
      case BEFORE_SHOW:
        clearTimeout(this.showTimer)
        this.showTimer = this.showTooltip()
        break
      case SHOW:
        break
      case BEFORE_HIDE:
        clearTimeout(this.hideTimer)
        this.animateState = SHOW
        break
    }
  }

  mouseLeave = () => {
    switch (this.animateState) {
      case HIDE:
        break
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
  }

  createElement = () => {
    this.el = document.getElementById(`tooltip-root-${this.rootSeed}`)
    // if (!this.el) {
    this.el = document.createElement('div')
    this.el.id = this.rootUniqueId
    this.el.classList.add(this.rootCommonClass)
    document.body.appendChild(this.el)
    // }
  }

  mapDomToArray = (doms = []) => {
    const ret = []
    for (let i = 0; i < doms.length; i++) {
      ret.push(doms[i])
    }
    return ret
  }

  removeElement = () => {
    // TODO 超过5个dom 删除之前的tooltip，需要告知被删除对象this.el = undefined
    // antd 实现思路是 一直保留dom， 隐藏的tooltip置为hidden
    ReactDOM.unmountComponentAtNode(this.el)
    document.body.removeChild(this.el)
    this.el = undefined
    // const doms = this.mapDomToArray(document.body.getElementsByClassName(this.rootCommonClass))
    // if (doms.length > 2) { // 一些优化 防止频繁增删dom节点 阈值:5
    //   let target
    //   doms.forEach(d => {
    //     console.log(d)
    //     if (d.id !== this.rootUniqueId) {
    //       target = d
    //       return void 0
    //     }
    //   })
    //   document.body.removeChild(target)
    //   // this.el = undefined // 不可能删除当前dom
    // }
  }

  showTooltip = () => {
    const { mouseEnterDelay } = this.props
    if (!this.el) {
      this.createElement()
    }
    // ReactDOM.unmountComponentAtNode(this.el)
    return setTimeout(() => {
      ReactDOM.render(
        React.cloneElement(
          <Popover {...this.props} />,
          {
            onMouseEnter: this.mouseEnter,
            onMouseLeave: this.mouseLeave,
            pos: this.containerPostion
          }
        ),
        this.el
      )
      this.animateState = SHOW
    }, mouseEnterDelay * 1000)
  }

  hideTooltip = () => {
    const { mouseLeaveDelay } = this.props
    return setTimeout(() => {
      this.removeElement()
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
    mouseLeaveDelay: 10
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
