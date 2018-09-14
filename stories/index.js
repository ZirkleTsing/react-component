import React from 'react';
import { storiesOf } from '@storybook/react';
import Button from '@stories/button'

storiesOf('Button', module)
  .add('常规', () =>  <Button/>)
