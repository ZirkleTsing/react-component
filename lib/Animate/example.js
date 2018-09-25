import React from 'react'
import Animate from './Animate'
import Button from '@/Button'
import './style.less'

function Demo (props) {
  return (
    <div className="box" id="box"></div>
  )
}

export default class extends React.Component {
  state = {
    isShow: true
  }

  toggle = () => {
    this.setState({
      isShow: !this.state.isShow
    })
  }

  handleAppear = () => {
    console.log('onAppear cb')
    const box = document.getElementById('box')
    box.style.visibility = ' '
  }

  handleLeave = () => {
    console.log('onLeave cb')
    const box = document.getElementById('box')
    box.style.visibility = 'hidden'
  }

  handleEnter = () => {
    console.log('onEnter cb')
    const box = document.getElementById('box')
    box.style.visibility = ''
  }

  render () {
    const { isShow } = this.state
    console.log(isShow)
    return (
      <React.Fragment>
        <Animate
          component=''
          showProp="isShow"
          onAppear={this.handleAppear}
          onLeave={this.handleLeave}
          onEnter={this.handleEnter}
          transitionName='rc-animate-example'
          transitionEnter
          transitionAppear
          transitionLeave
        >
          <Demo key="demo" isShow={isShow}></Demo>
        </Animate>
        <Button type="default" onClick={this.toggle}>点击</Button>
      </React.Fragment>
    )
  }
}
