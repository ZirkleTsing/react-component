import React from 'react'
import '@common/style/index.less'
import { Button } from '@/button'
export default () => {
  return (
    <React.Fragment>
      <Button style={{ marginLeft: '20px', marginTop: '20px' }} type="primary" onClick={() => console.log('点击')}>按钮示例</Button>
      <Button style={{ marginLeft: '20px', marginTop: '20px' }} type="danger" onClick={() => console.log('点击')}>按钮示例</Button>
      <Button style={{ marginLeft: '20px', marginTop: '20px' }} type="default" onClick={() => console.log('点击')}>按钮示例</Button>
    </React.Fragment>
  )
}
