import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RadioGroup from './RadioGroup';
import { FormStatusProps } from '../FormStatus/FormStatus';

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
const warning: FormStatusProps = { type: 'warning', message: 'These fields need your attention' };
const error: FormStatusProps = { type: 'error', message: 'These fields will block your progress' };

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
				error={warning}
			/>
		)
	})
	.add('With error', () => {
		return (
			<RadioGroup
				options={options}
				groupName="storybook-radio-group-with-warning"
				onChange={onChange}
				selected="one"
				legend="Radiogroup items"
				error={error}
			/>
		)
	})