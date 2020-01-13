import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ChoiceList, FormStatusProps } from '..';

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
			/>
		);
	})
	.add('Radio with preselected option', () => {
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
	.add('Radio with error', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
				status={error}
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
			/>
		);
	})
	.add('Single checkbox', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={[options[0]]}
				id="storybook-checklist"
				legend="Checklist items"
			/>
		);
	})
	.add('Checklist with warning', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				legend="Checklist items"
				status={warning}
			/>
		);
	})
	.add('Select', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
			/>
		);
	})
	.add('Select with success', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				status={success}
			/>
		);
	})
	.add('Select with other', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-checklist"
				otherInputLabel="Other choice"
			/>
		);
	});
