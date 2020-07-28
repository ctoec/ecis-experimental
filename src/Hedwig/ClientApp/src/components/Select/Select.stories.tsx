import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ChoiceList, FormStatusProps, ChoiceListExpansion } from '..';
import { TextInput } from '../TextInput/TextInput';
import { Select, SelectWithOther } from './Select';

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
const optionsWithOneExpansion = [
	{
		text: 'Option one',
		value: 'one',
		expansion: <p>Thank you for selecting option one!</p>,
	},
	{
		text: 'Option two',
		value: 'two',
	},
];
const optionsWithOneComplexExpansion = [
	{
		text: 'Option one',
		value: 'one',
		expansion: (
			<>
				<p>Thank you for selecting option one!</p>
				<TextInput
					id="radio-multi-text-input"
					label="Interactive Element?"
					defaultValue="Yes, you can!"
					onChange={onChange}
				/>
			</>
		),
	},
	{
		text: 'Option two',
		value: 'two',
	},
];
const optionsWithTwoExpansions = [
	{
		text: 'Option one',
		value: 'one',
		expansion: <p>Thank you for selecting option one!</p>,
	},
	{
		text: 'Option two',
		value: 'two',
		expansion: <p>Woo! #2</p>,
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

storiesOf('Select', module)
	.add('Select', () => {
		return <Select label="Select" onChange={onChange} options={options} id="storybook-select" />;
	})
	.add('Select with success', () => {
		return (
			<Select
				label="Select"
				onChange={onChange}
				options={options}
				id="storybook-select"
				status={success}
			/>
		);
	})
	.add('Select with warning', () => {
		return (
			<Select
				label="Select"
				onChange={onChange}
				options={options}
				id="storybook-select"
				status={warning}
			/>
		);
	})
	.add('Select with error', () => {
		return (
			<Select
				label="Select"
				onChange={onChange}
				options={options}
				id="storybook-select"
				status={error}
			/>
		);
	})
	.add('Select with other', () => {
		return (
			<SelectWithOther
				legend="Select with other"
				otherInputOnChange={onChange}
				otherOptionDisplay={'Other'}
				labelForSelect="Select"
				onChange={onChange}
				options={options}
				id="storybook-select"
				otherInputLabel="Other choice"
			/>
		);
	})
	.add('Disabled select', () => {
		return (
			<Select
				label="Select"
				onChange={onChange}
				options={options}
				id="storybook-select"
				disabled={true}
			/>
		);
	})
	.add('Select with one single element expansion', () => {
		return (
			<Select
				label="Select"
				onChange={onChange}
				options={optionsWithOneExpansion}
				id="storybook-select"
			/>
		);
	})
	.add('Select with one multi element expansion', () => {
		return (
			<Select
				label="Select"
				onChange={onChange}
				options={optionsWithOneComplexExpansion}
				id="storybook-select"
			/>
		);
	})
	.add('Select with both single element expansion', () => {
		return (
			<Select
				label="Select"
				onChange={onChange}
				options={optionsWithTwoExpansions}
				id="storybook-select"
			/>
		);
	});
