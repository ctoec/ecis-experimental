import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FormStatusProps } from '..';
import { TextInput } from '../TextInput/TextInput';
import { CheckboxOption, CheckboxGroup } from './CheckboxGroup';
import Checkbox from '../Checkbox/Checkbox';

const onChange = action('onChange');
const options: CheckboxOption[] = [
	{
		render: (props) => <Checkbox text="Option 1" {...props} />,
		value: 'one',
	},
	{
		render: (props) => <Checkbox text="Option 2" {...props} />,
		value: 'two',
	},
];
const optionsWithOneExpansion: CheckboxOption[] = [
	{
		render: (props) => <Checkbox text="Option 1" {...props} />,
		value: 'one',
		expansion: <p>Thank you for selecting option one!</p>,
	},
	{
		render: (props) => <Checkbox text="Option 2" {...props} />,
		value: 'two',
	},
];
const optionsWithOneComplexExpansion: CheckboxOption[] = [
	{
		render: (props) => <Checkbox text="Option 1" {...props} />,
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
		render: (props) => <Checkbox text="Option 2" {...props} />,
		value: 'two',
	},
];
const optionsWithTwoExpansions: CheckboxOption[] = [
	{
		render: (props) => <Checkbox text="Option 1" {...props} />,
		value: 'one',
		expansion: <p>Thank you for selecting option one!</p>,
	},
	{
		render: (props) => <Checkbox text="Option 2" {...props} />,
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

storiesOf('CheckboxGroup', module)
	.add('CheckboxGroup', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={options}
				id="storybook-CheckboxGroup"
			/>
		);
	})
	.add('CheckboxGroup with success', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={options}
				id="storybook-CheckboxGroup"
				status={success}
			/>
		);
	})
	.add('CheckboxGroup with warning', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={options}
				id="storybook-CheckboxGroup"
				status={warning}
			/>
		);
	})
	.add('CheckboxGroup with error', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={options}
				id="storybook-CheckboxGroup"
				status={error}
			/>
		);
	})
	.add('Disabled CheckboxGroup', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={options}
				id="storybook-CheckboxGroup"
				disabled={true}
			/>
		);
	})
	.add('CheckboxGroup with one single element expansion', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={optionsWithOneExpansion}
				id="storybook-CheckboxGroup"
			/>
		);
	})
	.add('CheckboxGroup with one multi element expansion', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={optionsWithOneComplexExpansion}
				id="storybook-CheckboxGroup"
			/>
		);
	})
	.add('CheckboxGroup with both single element expansion', () => {
		return (
			<CheckboxGroup
				legend="CheckboxGroup"
				onChange={onChange}
				options={optionsWithTwoExpansions}
				id="storybook-CheckboxGroup"
			/>
		);
	});
