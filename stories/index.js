import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@stories/button'
import Animate from '@stories/animate'
import Alert from '@stories/alert'

storiesOf('Button', module)
  .add('常规', () => <Button/>)

storiesOf('Animate', module)
  .add('常规', () => <Animate />)

storiesOf('Alert', module)
  .add('常规', () => <Alert />)
