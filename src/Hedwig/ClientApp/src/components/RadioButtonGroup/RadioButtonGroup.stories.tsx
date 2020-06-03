import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { FormStatusProps } from '..';
import { TextInput } from '../TextInput/TextInput';
import { RadioButtonGroup, RadioOption } from './RadioButtonGroup';
import RadioButton from '../RadioButton/RadioButton';
import '../../assets/styles/index.scss';

const onChange = action('onChange');
const options: RadioOption[] = [
	{
		render: (props) => <RadioButton text="Option 1" {...props} />,
		value: 'one',
	},
	{
		render: (props) => <RadioButton text="Option 2" {...props} />,
		value: 'two',
	},
];
const optionsWithOneExpansion: RadioOption[] = [
	{
		render: (props) => <RadioButton text="Option 1" {...props} />,
		value: 'one',
		expansion: <p>Thank you for selecting option one!</p>,
	},
	{
		render: (props) => <RadioButton text="Option 2" {...props} />,
		value: 'two',
	},
];
const optionsWithOneComplexExpansion: RadioOption[] = [
	{
		render: (props) => <RadioButton text="Option 1" {...props} />,
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
		render: (props) => <RadioButton text="Option 2" {...props} />,
		value: 'two',
	},
];
const optionsWithTwoExpansions: RadioOption[] = [
	{
		render: (props) => <RadioButton text="Option 1" {...props} />,
		value: 'one',
		expansion: <p>Thank you for selecting option one!</p>,
	},
	{
		render: (props) => <RadioButton text="Option 2" {...props} />,
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

storiesOf('RadioButtonGroup', module)
	.add('RadioButtonGroup', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={options}
				id="storybook-RadioButtonGroup"
			/>
		);
	})
	.add('Horizontal RadioButtonGroup', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-horizontal"
				legend="RadioButtonGroup"
				horizontal
				onChange={onChange}
				options={options}
				id="storybook-RadioButtonGroup"
			/>
		);
	})
	.add('RadioButtonGroup with success', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-success"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={options}
				id="storybook-RadioButtonGroup"
				status={success}
			/>
		);
	})
	.add('RadioButtonGroup with warning', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-warning"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={options}
				id="storybook-RadioButtonGroup"
				status={warning}
			/>
		);
	})
	.add('RadioButtonGroup with error', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-error"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={options}
				id="storybook-RadioButtonGroup"
				status={error}
			/>
		);
	})
	.add('Disabled RadioButtonGroup', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-disabled"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={options}
				id="storybook-RadioButtonGroup"
				disabled={true}
			/>
		);
	})
	.add('RadioButtonGroup with one single element expansion', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-exansion"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={optionsWithOneExpansion}
				id="storybook-RadioButtonGroup"
			/>
		);
	})
	.add('RadioButtonGroup with one multi element expansion', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-multi-element-expansion"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={optionsWithOneComplexExpansion}
				id="storybook-RadioButtonGroup"
			/>
		);
	})
	.add('RadioButtonGroup with both single element expansion', () => {
		return (
			<RadioButtonGroup
				name="radio-button-group-expansions"
				legend="RadioButtonGroup"
				onChange={onChange}
				options={optionsWithTwoExpansions}
				id="storybook-RadioButtonGroup"
			/>
		);
	});
