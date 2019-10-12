import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';

import RadioGroup from './RadioGroup';

const defaultText = 'Click me';
const onClick = action('onClick');

storiesOf('RadioGroup', module)
  .addDecorator(withKnobs)
  // .add('Default', () => {
  //   const customText = text('Text', defaultText);
  //   return <RadioGroup text={customText} onClick={onClick} />;
  // })
  // .add('Base', () => {
  //   const customText = text('Text', defaultText);
  //   return <RadioGroup text={customText} appearance="base" onClick={onClick} />;
  // })
  // .add('Secondary', () => {
  //   const customText = text('Text', defaultText);
  //   return <RadioGroup text={customText} appearance="secondary" onClick={onClick} />;
  // })
  // .add('Disabled', () => {
  //   const customText = text('Text', defaultText);
  //   return <RadioGroup text={customText} onClick={onClick} disabled />;
  // });
