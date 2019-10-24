import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RadioGroup from './RadioGroup';

const onClick = action('onClick');
const options = [
	{
		selected: true,
		text: 'Option one',
		value: 'one',
	},
	{
		selected: false,
		text: 'Option two',
		value: 'two',
	},
];

storiesOf('RadioGroup', module)
	.add('Default', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group"
				onClick={onClick}
				legend="Storybook radio buttons"
			/>
		);
	})
	.add('Horizontal', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group-2"
				onClick={onClick}
				legend="Storybook radio buttons"
				horizontal={true}
			/>
		);
	})
	.add('Default selection', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group-default-selection"
				onClick={onClick}
				legend="Storybook radio buttons"
				selected="one"
			/>
		);
	})
	.add('With error', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group-with-error"
				onClick={onClick}
				legend="Storybook radio buttons"
				showError={true}
				errorMessage="You  must select one or two."
			/>
		);
	});
