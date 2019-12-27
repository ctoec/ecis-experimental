import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Checklist from './Checklist';
import { FormErrorProps } from '../FormError/FormError';

const onChange = action('onChange');
const options = [
	{
		checked: false,
		text: 'Option one',
		value: 'one',
		onChange: onChange,
	},
	{
		checked: false,
		text: 'Option two',
		value: 'two',
		onChange: onChange,
	},
];
const warning: FormErrorProps ={ type: 'warning', message: 'These fields need your attention' };
const error: FormErrorProps ={ type: 'error', message: 'These fields will block your progress' };

const optionsSelected = options.map(option => Object.assign({}, option, { checked: true }));
const boxDisabledAndSelected = optionsSelected.map(option =>
	Object.assign({}, option, { disabled: true })
);

storiesOf('Checklist', module)
	.add('Default', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist"
				legend="Checklist items"
			/>
		);
	})
	.add('Horizontal', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist-2"
				horizontal={true}
				legend="Checklist items"
			/>
		);
	})
	.add('Default selection', () => {
		return (
			<Checklist
				options={optionsSelected}
				groupName="storybook-checklist-default-selection"
				legend="Checklist items"
			/>
		);
	})
	.add('Box disabled', () => {
		return (
			<Checklist
				options={boxDisabledAndSelected}
				groupName="storybook-checklist-disabled"
				legend="Checklist items"
			/>
		);
	})
	.add('With warning', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist-with-warning"
				legend="Checklist items"
				error={warning}
			/>
		)
	})
	.add('With error', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist-with-error"
				legend="Checklist items"
				error={error}
			/>
		)
	})
