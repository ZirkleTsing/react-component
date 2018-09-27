import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Animate from '@/Animate'

function noop () {}

let seed = 0

class Alert extends React.Component {
  static propTypes = {
    time: PropTypes.number,
    type: PropTypes.oneOf(['success', 'warning', 'warning']),
    msg: PropTypes.string.isRequired,
    onEnd: PropTypes.func
  }

  static defaultProps = {
    onEnd: noop,
    time: 2000,
    type: 'success'
  }

  componentDidMount () {
    const props = this.props
    setTimeout(props.onEnd, props.time)
  }

  render () {
    const style = {
      background: 'yellow',
      width: 600,
      padding: 20,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
    return <div style={style}>{this.props.msg}</div>
  }
}

class AlertGroup extends React.Component {
  static displayName = 'rc-Alert'

  static defaultProps = {
    prefixCls: 'rc-alert',
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
