import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@/button';
import './style.less';

storiesOf('Button', module)
  .add('常规', () => {
    return (
        <React.Fragment>
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
        </React.Fragment>
      )
  })
