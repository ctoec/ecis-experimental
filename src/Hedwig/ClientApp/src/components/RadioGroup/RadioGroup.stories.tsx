import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { RadioGroup, FormStatusProps } from '..';

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
const warning: FormStatusProps = {
	type: 'warning',
	message: 'These fields need your attention',
	id: 'radio-group-warning',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'This value was accepted',
	id: 'radio-group-status',
};
const error: FormStatusProps = {
	type: 'error',
	message: 'These fields will block your progress',
	id: 'radio-group-error',
};

storiesOf('RadioGroup', module)
	.add('Default', () => {
		return (
			<RadioGroup
				options={options}
				id="storybook-radio-group"
				onChange={onChange}
				legend="Radiogroup items"
			/>
		);
	})
	.add('Horizontal', () => {
		return (
			<RadioGroup
				options={options}
				id="storybook-radio-group-2"
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
				id="storybook-radio-group-default-selection"
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
				id="storybook-radio-group-with-warning"
				onChange={onChange}
				selected="one"
				legend="Radiogroup items"
				status={warning}
			/>
		);
	})
	.add('With success', () => {
		return (
			<RadioGroup
				options={options}
				id="storybook-radio-group-with-warning"
				onChange={onChange}
				selected="one"
				legend="Radiogroup items"
				status={success}
			/>
		);
	})
	.add('With error', () => {
		return (
			<RadioGroup
				options={options}
				id="storybook-radio-group-with-warning"
				onChange={onChange}
				selected="one"
				legend="Radiogroup items"
				status={error}
			/>
		);
	});
