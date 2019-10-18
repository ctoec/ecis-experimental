import React from 'react';
import { storiesOf } from '@storybook/react';

import InlineIcon from './InlineIcon';

storiesOf('Button', module).add('Attention needed', () => {
	return <InlineIcon icon="attentionNeeded" />;
});
