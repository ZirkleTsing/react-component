import React from 'react'
import '@common/style/index.less'
import { Button } from '@/button'
// import Calendar from 'rc-calendar';
import Animate from '@/index'

const Button = 
  <React.Fragment>
    <Button style={{ marginLeft: '20px', marginTop: '20px' }} type="primary" onClick={() => console.log('点击')}>按钮示例</Button>
    <Button style={{ marginLeft: '20px', marginTop: '20px' }} type="danger" onClick={() => console.log('点击')}>按钮示例</Button>
    <Button style={{ marginLeft: '20px', marginTop: '20px' }} type="default" onClick={() => console.log('点击')}>按钮示例</Button>
    <Button style={{ marginLeft: '20px', marginTop: '20px' }} type="dashed" onClick={() => console.log('点击')}>按钮示例</Button>
    <Button style={{ marginLeft: '20px', marginTop: '20px' }} icon="add" type="dashed" onClick={() => console.log('点击')}>按钮示例</Button>
  </React.Fragment>

export default () => {
  return (
    <React.Fragment>
      <Animate></Animate>
    </React.Fragment>
  )
}
