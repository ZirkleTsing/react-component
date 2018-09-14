import React from 'react'
import { Button } from '@/button';
import { action } from '@storybook/addon-actions';
import './style.less';

export default () => {
  return (
    <React.Fragment>
      <div style={{marginBottom: '10px'}}>
        <div>常规Button示例</div>
        <div>按钮有四种类型：主按钮、次按钮、虚线按钮、危险按钮。</div>
      </div>
      <Button
        type="primary"
        onClick={() => {
          console.log('demo')
          action('clicked')
        }}
        className="storybook-rc-btn"
      >
        Primary
      </Button>
      <Button
        type="danger"
        onClick={() => {
          console.log('demo')
          action('clicked')
        }}
        className="storybook-rc-btn"
      >
        Danger
      </Button>
      <Button
        onClick={() => {
          console.log('demo')
          action('clicked')
        }}
        className="storybook-rc-btn"
      >
        Default
      </Button>
      <Button
        type="dashed"
        onClick={() => {
          console.log('demo')
          action('clicked')
        }}
        className="storybook-rc-btn"
      >
        Dashed
      </Button>
      <Button
        icon="add"
        onClick={() => {
          console.log('demo')
          action('clicked')
        }}
        className="storybook-rc-btn"
      >
        Add
      </Button>
    </React.Fragment>
  )
}
