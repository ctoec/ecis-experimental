import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TextInput from './TextInput';

const onChange = action('onChange');

storiesOf('TextInput', module)
	.add('Default', () => {
		return <TextInput id="cat" label="Default text input" onChange={onChange} />;
	})
	.add('With default value', () => {
		return <TextInput id="cat" label="Default text input" onChange={onChange} defaultValue="default text" />;
	})
	.add('Optional', () => {
		return <TextInput id="cat" label="Default optional text input" onChange={onChange} optional={true} />;
	})
	.add('Disabled', () => {
		return <TextInput id="cat" label="Default text input" onChange={onChange} disabled />;
	})
	.add('Success', () => {
		return <TextInput id="cat" label="Default text input" onChange={onChange} success />;
	})
	.add('Error', () => {
		return <TextInput id="cat" label="Default text input" onChange={onChange} error="Fix this error" />;
	});
