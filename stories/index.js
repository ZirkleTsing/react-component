import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from '@/button';

storiesOf('Button', module)
  .add('with text', () => {
    return (
      <Button
        style={{ marginLeft: '20px', marginTop: '20px' }}
        type="primary"
        onClick={() => {
          console.log('demo')
          action('clicked')
        }}
      >
        Hello World
      </Button>
      )
  })
