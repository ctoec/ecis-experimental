import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Dropdown from './Dropdown';

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

storiesOf('Dropdown', module)
	.add('Default', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				unselectedOptionText="Choose here"
				onChange={onChange}
			/>
		);
	})
	.add('Error', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				unselectedOptionText="Choose here"
				onChange={onChange}
				error={true}
				errorMessage="There was an error."
			/>
		);
	})
	.add('Success', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				unselectedOptionText="Choose here"
				onChange={onChange}
				success={true}
			/>
		);
	})
	.add('Disabled', () => {
		return (
			<Dropdown
				options={options}
				label="Choose one of these things"
				unselectedOptionText="Choose here"
				onChange={onChange}
				disabled={true}
			/>
		);
	});
