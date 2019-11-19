import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Checklist from './Checklist';

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
				legend="Storybook check buttons"
			/>
		);
	})
	.add('Horizontal', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist-2"
				legend="Storybook check buttons"
				horizontal={true}
			/>
		);
	})
	.add('Default selection', () => {
		return (
			<Checklist
				options={optionsSelected}
				groupName="storybook-checklist-default-selection"
				legend="Storybook check buttons"
			/>
		);
	})
	.add('With error', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist-with-error"
				legend="Storybook check buttons"
				error="You  must select one or two."
			/>
		);
	})
	.add('Box disabled', () => {
		return (
			<Checklist
				options={boxDisabledAndSelected}
				groupName="storybook-checklist-with-error"
				legend="Storybook check buttons"
			/>
		);
	});
