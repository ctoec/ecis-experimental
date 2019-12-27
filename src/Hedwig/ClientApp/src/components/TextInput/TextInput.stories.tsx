import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import TextInput from './TextInput';
import FieldSet from '../FieldSet/FieldSet';
import { FormErrorProps } from '../FormError/FormError';

const onChange = action('onChange');
const warning: FormErrorProps = { type: 'warning', message: 'Warning!' };
const error: FormErrorProps = { type: 'error', message: 'Error!' };

storiesOf('TextInput', module)
	.add('Default', () => {
		return <TextInput id="id" label="Default text input" onChange={onChange} />;
	})
	.add('With default value', () => {
		return <TextInput id="id1" label="Default text input" onChange={onChange} defaultValue="default text" />;
	})
	.add('Optional', () => {
		return <TextInput id="id2" label="Default optional text input" onChange={onChange} optional={true} />;
	})
	.add('Disabled', () => {
		return <TextInput id="id3" label="Default text input" onChange={onChange} disabled />;
	})
	.add('Success', () => {
		return <TextInput id="id4" label="Default text input" onChange={onChange} success />;
	})
	.add('Warning', () => {
		return <TextInput id="id5" label="Default text input" onChange={onChange} error={warning} />;
	})
	.add('Warning inside warning Fieldset', () => {
		return (
			<div className="usa-form">
				<FieldSet
					legend="Text inputs"
					error={warning}
					display="inline-block"
					id="example-fieldset-warning"
				>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<TextInput id="id6" label="Short" onChange={onChange} error={warning} />
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput id="id7" label="Long" onChange={onChange} error={warning} />
					</div>
				</FieldSet>
			</div>
		)
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
					display="inline-block"
					id="warning-fieldset"
				>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<TextInput id="cat" label="Short" onChange={onChange} error={warning} />
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput id="cat" label="Long" onChange={onChange} error={warning} />
					</div>
				</FieldSet>
			</div>
		)
	})
	.add('Error', () => {
		return <TextInput id="id8" label="Default text input" onChange={onChange} error={error} />
	})
	.add('Error inside error Fieldset', () => {
		return (
			<div className="usa-form">
				<FieldSet
					legend="Text inputs"
					error={error}
					display="inline-block"
					id="example-fieldset-error"
				>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<TextInput id="id9" label="Short" onChange={onChange} error={error} />
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput id="id10" label="Long" onChange={onChange} error={error} />
					</div>
				</FieldSet>
			</div>
		);
	})
