import React from 'react';
import { storiesOf } from '@storybook/react';

import InlineIcon from './InlineIcon';

storiesOf('InlineIcon', module)
	.add('Attention needed', () => {
		return <InlineIcon icon="attentionNeeded" />;
	})
	.add('Complete', () => {
		return <InlineIcon icon="complete" />;
	})
	.add('Incomplete', () => {
		return <InlineIcon icon="incomplete" />;
	});
