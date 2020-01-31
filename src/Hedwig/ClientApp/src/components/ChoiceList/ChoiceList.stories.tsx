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
				id="storybook-radio"
				legend="Radio items"
			/>
		);
	})
	.add('Radio with preselected option', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				id="storybook-radio"
				legend="Radio items"
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
				id="storybook-radio"
				legend="Radio items"
				status={error}
			/>
		);
	})
	.add('Disabled radio', () => {
		return (
			<ChoiceList
				type="radio"
				onChange={onChange}
				options={options}
				disabled={true}
				id="storybook-radio"
				legend="Radio items"
			/>
		)
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
	.add('Disabled checklist', () => {
		return (
			<ChoiceList
				type="check"
				onChange={onChange}
				options={options}
				disabled={true}
				id="storybook-checklist"
				legend="Checklist items"
			/>
		)
	})
	.add('Select', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				id="storybook-select"
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
				id="storybook-select"
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
				id="storybook-select"
				otherInputLabel="Other choice"
			/>
		);
	})
	.add('Disabled select', () => {
		return (
			<ChoiceList
				label="Select"
				type="select"
				onChange={onChange}
				options={options}
				disabled={true}
				id="storybook-select"
			/>
		);
	});
