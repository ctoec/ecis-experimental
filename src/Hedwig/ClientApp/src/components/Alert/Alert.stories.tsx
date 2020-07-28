import React from 'react';
import { storiesOf } from '@storybook/react';

import { Alert } from '..';

storiesOf('Alert', module)
	.add('Success', () => {
		return <Alert type={'success'} heading="Success alert!" text="Good job, you." />;
	})
	.add('Warning', () => {
		return <Alert type={'warning'} heading="Watch out!" text="Is that what you meant to do?" />;
	})
	.add('Error', () => {
		return <Alert type={'error'} heading="Hark, an error!" text="Something's not right." />;
	})
	.add('Info', () => {
		return <Alert type={'info'} heading="Information" text="Neutral text here." />;
	});
