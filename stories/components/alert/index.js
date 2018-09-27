import React from 'react'
import alert from '@/Alert'
import Button from '@/Button'

const buttonStyle = { marginLeft: 20, marginTop: 20 }

export default class extends React.Component {
  static compName = 'Alert'
  alertClick = () => alert({ msg: '小刘鸭!' })

  render () {
    return (
      <React.Fragment>
        <Button style={buttonStyle} type="primary" onClick={this.alertClick}>Success</Button>
        <Button style={buttonStyle} type="danger" onClick={() => alert({ msg: '危险', type: 'danger' })}>Danger</Button>
        <Button style={buttonStyle} type="dashed" onClick={() => alert({ msg: '警告', type: 'warning' })}>Warning</Button>
      </React.Fragment>
    )
  }
}
