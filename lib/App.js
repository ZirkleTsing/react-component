import React from 'react'
import '@common/style/index.less'
import { Button } from '@/Button'
import AnimateExample from '@/Animate/example'
import alert from '@/Alert'

const buttonStyle = { marginLeft: '20px', marginTop: '20px' }
const buttonClick = () => console.log('点击')
const button =
  <React.Fragment>
    <Button style={buttonStyle} type="primary" onClick={buttonClick}>按钮示例</Button>
    <Button style={buttonStyle} type="danger" onClick={buttonClick}>按钮示例</Button>
    <Button style={buttonStyle} type="default" onClick={buttonClick}>按钮示例</Button>
    <Button style={buttonStyle} type="dashed" onClick={buttonClick}>按钮示例</Button>
    <Button style={buttonStyle} icon="add" type="dashed" onClick={buttonClick}>按钮示例</Button>
  </React.Fragment>

const alertClick = () => alert({ msg: '成功' })

export default () => {
  return (
    <React.Fragment>
      <Button style={buttonStyle} type="primary" onClick={alertClick}>Success</Button>
      <Button style={buttonStyle} type="danger" onClick={() => alert.danger({ msg: '危险' })}>Danger</Button>
      <Button style={buttonStyle} type="dashed" onClick={() => alert.warning({ msg: '警告' })}>Warning</Button>
    </React.Fragment>
  )
}
