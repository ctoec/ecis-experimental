import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Checklist from './Checklist';

const onClick = action('onClick');
const options = [
	{
		checked: false,
		text: 'Option one',
		value: 'one',
	},
	{
		checked: false,
		text: 'Option two',
		value: 'two',
	},
];

const optionsSelected = options.map(option => Object.assign({}, option, { checked: true}));
const boxDisabledAndSelected = options.map(option => Object.assign({}, option, { checked: true }));

storiesOf('Checklist', module)
	.add('Default', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist"
				onClick={onClick}
				legend="Storybook check buttons"
			/>
		);
	})
	.add('Horizontal', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist-2"
				onClick={onClick}
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
				onClick={onClick}
				legend="Storybook check buttons"
			/>
		);
	})
	.add('With error', () => {
		return (
			<Checklist
				options={options}
				groupName="storybook-checklist-with-error"
				onClick={onClick}
				legend="Storybook check buttons"
				showError={true}
				errorMessage="You  must select one or two."
			/>
    )
  })
	.add('Box disabled', () => {
		return (
			<Checklist
				options={boxDisabledAndSelected}
				groupName="storybook-checklist-with-error"
				onClick={onClick}
				legend="Storybook check buttons"
				errorMessage="You  must select one or two."
			/>
		);
	});
