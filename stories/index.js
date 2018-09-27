import React from 'react';
import { getStoriesOf } from '@stories/utils'
// import { action } from '@storybook/addon-actions';
import Button from '@stories/components/button'
import Animate from '@stories/components/animate'
import Alert from '@stories/components/alert'

const storybook = [
  {
    directory: 'Button',
    stories: [
      {
        name: '常规',
        story: () => <Button />
      }
    ]
  }, {
    directory: 'Animate',
    stories: [
      {
        name: '常规',
        story: () => <Animate />
      }
    ]
  }, {
    directory: 'Alert',
    stories: [
      {
        name: '常规',
        story: () => <Alert />
      }
    ]
  }
]

storybook.forEach(({ directory, stories }) => {
  getStoriesOf(directory, stories)
})
