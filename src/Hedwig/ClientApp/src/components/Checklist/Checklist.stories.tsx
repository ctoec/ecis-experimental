import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Checklist from './Checklist';
import { FormStatusProps } from '../FormStatus/FormStatus';

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
const warning: FormStatusProps = {
	type: 'warning',
	message: 'These fields need your attention',
	id: 'checklist-warning',
};
const error: FormStatusProps = {
	type: 'error',
	message: 'These fields will block your progress',
	id: 'checklis-error',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'These fields were validated woo',
	id: 'checklist-success',
};

const optionsSelected = options.map(option => Object.assign({}, option, { checked: true }));
const boxDisabledAndSelected = optionsSelected.map(option =>
	Object.assign({}, option, { disabled: true })
);

storiesOf('Checklist', module)
	.add('Default', () => {
		return <Checklist options={options} id="storybook-checklist" legend="Checklist items" />;
	})
	.add('Horizontal', () => {
		return (
			<Checklist
				options={options}
				id="storybook-checklist-2"
				horizontal={true}
				legend="Checklist items"
			/>
		);
	})
	.add('Default selection', () => {
		return (
			<Checklist
				options={optionsSelected}
				id="storybook-checklist-default-selection"
				legend="Checklist items"
			/>
		);
	})
	.add('Box disabled', () => {
		return (
			<Checklist
				options={boxDisabledAndSelected}
				id="storybook-checklist-disabled"
				legend="Checklist items"
			/>
		);
	})
	.add('With warning', () => {
		return (
			<Checklist
				options={options}
				id="storybook-checklist-with-warning"
				legend="Checklist items"
				status={warning}
			/>
		);
	})
	.add('With error', () => {
		return (
			<Checklist
				options={options}
				id="storybook-checklist-with-error"
				legend="Checklist items"
				status={error}
			/>
		);
	})
	.add('With success', () => {
		return (
			<Checklist
				options={options}
				id="storybook-checklist-with-success"
				legend="Checklist items"
				status={success}
			/>
		);
	});
