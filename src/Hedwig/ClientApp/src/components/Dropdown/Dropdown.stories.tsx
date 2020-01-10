import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Dropdown, FormStatusProps } from '..';

const onChange = action('onChange');
const options = [
	{
		value: 'one',
		text: 'Thing One',
	},
	{
		value: 'two',
		text: 'Thing Two',
	},
];
const error: FormStatusProps = {
	type: 'error',
	message: 'Pick something else',
	id: 'dropdown-error',
};
const warning: FormStatusProps = {
	type: 'warning',
	message: 'Choose wisely',
	id: 'dropdown-warning',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'You did good',
	id: 'dropdown-success',
};

storiesOf('Dropdown', module)
	.add('Default', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				noSelectionText="Choose here"
				onChange={onChange}
				id="default-dropdown"
			/>
		);
	})
	.add('Error', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				noSelectionText="Choose here"
				onChange={onChange}
				status={error}
				id="dropdown-with-error"
			/>
		);
	})
	.add('Success', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				noSelectionText="Choose here"
				onChange={onChange}
				status={success}
				id="dropdown-with-success"
			/>
		);
	})
	.add('Warning', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				noSelectionText="Choose here"
				onChange={onChange}
				status={warning}
				id="dropdown-with-success"
			/>
		);
	})
	.add('Disabled', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				noSelectionText="Choose here"
				onChange={onChange}
				disabled={true}
				id="disabled-dropdown"
			/>
		);
	})
	.add('With other text', () => {
		return (
			<Dropdown
				options={options}
				label="Chose one of these things"
				onChange={onChange}
				otherText="or make up your own thing"
				id="with-other-text-dropdown"
			/> 
		)
	})
