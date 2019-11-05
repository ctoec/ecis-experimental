import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TextInput from './TextInput';

const onChange = action('onChange');

storiesOf('TextInput', module)
	.add('Default', () => {
		return <TextInput label="Default text input" onChange={onChange} />;
	})
	.add('With default value', () => {
		return <TextInput label="Default text input" onChange={onChange} defaultValue="default text" />;
	})
	.add('Disabled', () => {
		return <TextInput label="Default text input" onChange={onChange} disabled={true} />;
	})
	.add('Success', () => {
		return <TextInput label="Default text input" onChange={onChange} success={true} />;
	})
	.add('Error', () => {
		return (
			<TextInput
				label="Default text input"
				onChange={onChange}
				error={true}
				errorMessage="Fix this error"
			/>
		);
	});
