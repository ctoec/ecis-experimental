import React from 'react';
import { storiesOf } from '@storybook/react';

import Fieldset from './FieldSet';

storiesOf('FieldSet', module)
  .add('Default', () => {
    return <Fieldset
      legend="field set"
    >
      <p>I'm inside a field set!</p>
    </Fieldset>
  })
  .add('With Warning', () => {
    return <Fieldset
      legend="warning field set"
    >
      <p> Oh no! </p>
      <p> We have warnings! </p>
    </Fieldset>
  });