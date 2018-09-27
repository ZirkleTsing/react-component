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
    time: 20000,
    type: 'success',
    prefixCls: 'rc-alert',
    className: '',
    title: '提交成功',
    closeable: true
  }

  componentDidMount () {
    const props = this.props
    this.timer = setTimeout(props.onEnd, props.time)
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
          <div className={`${prefixCls}-content-title`}>{title}</div>
          <div className={`${prefixCls}-content-body`}>{msg}</div>
        </div>
        {closeable && <Icon iconType='empty' className={`${prefixCls}-close`} onClick={this.handleClose} />}
      </div>
    )
  }
}

class AlertGroup extends React.Component {
  static displayName = 'rc-Alert'

  static defaultProps = {
    prefixCls: 'rc-alert-group',
    wrapperStyle: {
      position: 'fixed',
      width: '100%',
      top: 50,
      zIndex: 9999
    }
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
    const props = this.props
    const children = alertArray.map(alertProps => {
      if (!alertProps.key) {
        seed++
        alertProps.key = seed + ''
      }
      return React.cloneElement(<Alert {...alertProps} />, {
        onEnd: this.onEnd.bind(this, alertProps.key)
      })
    })
    return (
      <Animate
        transitionName={`${props.prefixCls}`}
        component='div' // this mode support multiple component
        style={props.wrapperStyle}
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

export default alert
