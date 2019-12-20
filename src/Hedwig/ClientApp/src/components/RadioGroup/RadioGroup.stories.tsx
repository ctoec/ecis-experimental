import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RadioGroup from './RadioGroup';

const onChange = action('onChange');
const options = [
	{
		text: 'Option one',
		value: 'one',
	},
	{
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
				onChange={onChange}
				legend="Radiogroup items"
			/>
		);
	})
	.add('Horizontal', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group-2"
				onChange={onChange}
				horizontal={true}
				legend="Radiogroup items"
			/>
		);
	})
	.add('Default selection', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group-default-selection"
				onChange={onChange}
				selected="one"
				legend="Radiogroup items"
			/>
		);
	})
	.add('With warning', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group-with-warning"
				onChange={onChange}
				selected="one"
				legend="Radiogroup items"
				warning="WARNING: This section needs your attention!"
			/>
		)
	});
