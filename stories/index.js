import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@stories/button'
import Animate from '@stories/animate'

storiesOf('Button', module)
  .add('常规', () => <Button/>)

storiesOf('Animate', module)
  .add('常规', () => <Animate />)
