import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Button from '@stories/button'
import './style.less';

storiesOf('Button', module)
  .add('常规', () =>  <Button/>)
