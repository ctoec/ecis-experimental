import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ChoiceList from './ChoiceList';
import { FormStatusProps } from '../FormStatus/FormStatus';

const onChange = action('onChange');
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

storiesOf('ChoiceList', module)
	.add('Radio', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
				selected={['one']}
			/>
		);
	})
	.add('Checklist', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
				selected={['one']}
			/>
		);
	})
	.add('Select', () => {
		return (
			<ChoiceList
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
				selected={['one']}
			/>
		);
	})
	.add('Other', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
				selected={['one']}
				otherText="Other choice"
			/>
		);
	});
