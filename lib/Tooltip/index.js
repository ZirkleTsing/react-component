import React from 'react'
import ReactDOM from 'react-dom'
import Animate from '@/Animate'
import './style.less'

class Popover extends React.Component {
  render () {
    return (
      <Animate
        transitionName="rc-tooltip-container"
        transitionAppear
        transitionEnter
        transitionLeave
        component='div'
      >
        <div className="rc-tooltip">
          {this.props.title}
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
  }

  showTooltip = () => {
    ReactDOM.render(<Popover title={this.props.title} />, this.el)
  }

  hideTooltip = () => {
    ReactDOM.unmountComponentAtNode(this.el)
  }

  render () {
    return this.props.children
  }
}

class Tooltip extends React.Component {
  showTooltip = () => {
    this.container.showTooltip()
  }

  hideTooltip = () => {
    this.container.hideTooltip()
  }

  render () {
    const { title } = this.props
    return (
      <PopupContainer title={title} ref={ctx => { this.container = ctx }}>
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
