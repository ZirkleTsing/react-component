import React from 'react'
import alert from '@/Alert'
import Button from '@/Button'

export default class extends React.Component {
  alertClick = () => alert({ msg: '小刘鸭!' })

  render () {
    return (
      <React.Fragment>
        <Button type="primary" onClick={this.alertClick}>点击触发alert</Button>
      </React.Fragment>
    )
  }
}
