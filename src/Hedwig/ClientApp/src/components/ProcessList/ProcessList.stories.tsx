import React from 'react';
import { storiesOf } from '@storybook/react';
import { ProcessList } from './ProcessList';

const defaultStepProps = {
	heading: 'Step heading',
	body: 'step content',
};

storiesOf('ProcessList', module).add('Default', () => {
	return (
		<ProcessList
			processStepProps={[
				{
					...defaultStepProps,
					heading: 'A long, long, long, long, long heading',
					isNew: true,
				},
				{
					...defaultStepProps,
					isNew: true,
				},
				{
					...defaultStepProps,
					heading: 'A long, long, long, long, long heading',
				},
				{
					...defaultStepProps,
				},
			]}
		/>
	);
});
