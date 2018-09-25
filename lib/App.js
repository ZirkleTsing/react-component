import React from 'react'
import '@common/style/index.less'
import { Button } from '@/Button'
import AnimateExample from '@/Animate/example'

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

export default () => {
  return (
    <React.Fragment>
      <AnimateExample />
    </React.Fragment>
  )
}
