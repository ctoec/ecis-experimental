import React from 'react';
import { storiesOf } from '@storybook/react';

import { default as StepList, StepListProps } from './StepList';

const props: StepListProps<any> = {
	steps: [
		{
			key: '1',
			name: 'One small step',
			status: () => 'complete',
			editPath: '1',
			Summary: () => <p>For a man.</p>,
			Form: () => <></>,
		},
		{
			key: '2',
			name: 'One giant leap',
			status: () => 'complete',
			editPath: '2',
			Summary: () => <></>,
			Form: () => <p>For mankind.</p>,
		},
		{
			key: '3',
			name: 'To infinity and beyond',
			status: () => 'complete',
			editPath: '3',
			Summary: () => <></>,
			Form: () => <></>,
		},
	],
	props: {},
	activeStep: '2',
};

storiesOf('StepList', module).add('Default', () => {
	return <StepList {...props} />;
});
