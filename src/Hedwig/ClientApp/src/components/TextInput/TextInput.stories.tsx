import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TextInput from './TextInput';
import FieldSet, { FormError } from '../FieldSet/FieldSet';

const onChange = action('onChange');
const warning: FormError = { type: 'warning', message: 'Warning!' };
const error: FormError = { type: 'error', message: 'Error!' };

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
	.add('Warning', () => {
		return <TextInput id="cat" label="Default text input" onChange={onChange} error={warning} />;
	})
	.add('Warning inside warning Fieldset', () => {
		return (
			<div className="usa-form">
				<FieldSet
					legend="Text inputs"
					error={warning}
				>
					<div className="mobile-lg:grid-col-4 inline-block">
						<TextInput id="cat" label="Short" onChange={onChange} error={warning} />
					</div>
					<div className="mobile-lg:grid-col-8 inline-block">
						<TextInput id="cat" label="Long" onChange={onChange} error={warning} />
					</div>
				</FieldSet>
			</div>
		)
	})
	.add('Error', () => {
		return <TextInput id="cat" label="Default text input" onChange={onChange} error={error} />
	})
	.add('Error inside error Fieldset', () => {
		return (
			<div className="usa-form">
				<FieldSet
					legend="Text inputs"
					error={error}
					inlineBlock={true}
				>
					<div className="mobile-lg:grid-col-4 inline-block">
						<TextInput id="cat" label="Short" onChange={onChange} error={error} />
					</div>
					<div className="mobile-lg:grid-col-8 inline-block">
						<TextInput id="cat" label="Long" onChange={onChange} error={error} />
					</div>
				</FieldSet>
			</div>
		)
	})
