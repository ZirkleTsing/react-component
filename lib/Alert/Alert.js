import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Animate from '@/Animate'
import './style.less'
import classnames from 'classnames'
import Icon from '@/Icon'

function noop () {}

let seed = 0

const iconMaps = {
  success: 'success',
  danger: 'icon_danger',
  warning: 'warning'
}

const defaultAlertTitleMaps = {
  success: '成功啦',
  danger: '危险',
  warning: '请注意'
}

class Alert extends React.Component {
  static propTypes = {
    time: PropTypes.number,
    type: PropTypes.oneOf(['success', 'warning', 'danger']),
    msg: PropTypes.string.isRequired,
    onEnd: PropTypes.func,
    className: PropTypes.string,
    prefixCls: PropTypes.string,
    title: PropTypes.string,
    closeable: PropTypes.bool
  }

  static defaultProps = {
    onEnd: noop,
    time: 2000,
    type: 'success',
    prefixCls: 'rc-alert',
    className: '',
    title: '',
    closeable: true
  }

  componentDidMount () {
    const props = this.props
    this.timer = setTimeout(props.onEnd, props.time)
  }

  componentWillUnmount () {
    clearTimeout(this.timer)
  }

  handleClose = () => {
    clearTimeout(this.timer)
    this.props.onEnd()
  }

  render () {
    const { prefixCls, className, type, msg, title, closeable } = this.props
    const classes = classnames(prefixCls, className, {
      [`${prefixCls}-${type}`]: true
    })
    return (
      <div className={classes}>
        <Icon
          iconType={iconMaps[type] || 'success'}
          className={`${prefixCls}-icon`}
        />
        <div className={`${prefixCls}-content`}>
          <div className={`${prefixCls}-content-title`}>{title || defaultAlertTitleMaps[type]}</div>
          <div className={`${prefixCls}-content-body`}>{msg}</div>
        </div>
        {closeable && <Icon iconType='empty' className={`${prefixCls}-close`} onClick={this.handleClose} />}
      </div>
    )
  }
}

class AlertGroup extends React.Component {
  static displayName = 'rc-Alert'

  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    prefixCls: 'rc-alert-group'
  }

  state = {
    alerts: []
  }

  onEnd = (key) => {
    const { alerts } = this.state
    const ret = []
    let target = null
    alerts.forEach(a => {
      if (a.key === key) {
        target = a
      } else {
        ret.push(a)
      }
    })
    if (target) {
      this.setState({
        alerts: ret
      }, () => {
        target.cb && target.cb()
      })
    }
  }

  addAlert = (a) => {
    this.setState({
      alerts: this.state.alerts.concat(a)
    })
  }

  render () {
    const { alerts: alertArray } = this.state
    const { prefixCls, style, className } = this.props
    const children = alertArray.map(alertProps => {
      if (!alertProps.key) {
        seed++
        alertProps.key = seed + ''
      }
      return React.cloneElement(<Alert {...alertProps} />, {
        onEnd: this.onEnd.bind(this, alertProps.key)
      })
    })
    const classes = classnames(prefixCls, className)
    return (
      <Animate
        transitionName={`${prefixCls}`}
        component='div' // this mode support multiple component
        className={classes}
        style={style}
        transitionEnter
        transitionLeave
      >
        {children}
      </Animate>
    )
  }
}

let alertGroup = null

function alert ({ msg, time, type, cb }) {
  if (!alertGroup) {
    const div = window.document.createElement('div')
    window.document.body.appendChild(div)
    alertGroup = ReactDOM.render(<AlertGroup />, div)
  }
  alertGroup.addAlert({ msg, time, type, cb })
}

alert.success = function (args) {
  alert({ ...args, type: 'success' })
}

alert.danger = function (args) {
  alert({ ...args, type: 'danger' })
}

alert.warning = function (args) {
  alert({ ...args, type: 'warning' })
}

export default alert
