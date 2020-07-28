import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TextInput, FieldSet, FormStatusProps } from '..';

const onChange = action('onChange');
const warning: FormStatusProps = { type: 'warning', message: 'Warning!', id: 'text-input-warning' };
const error: FormStatusProps = { type: 'error', message: 'Error!', id: 'text-input-error' };
const success: FormStatusProps = { type: 'success', message: 'Success!', id: 'text-input-success' };

storiesOf('TextInput', module)
	.add('Default', () => {
		return <TextInput type="input" id="id" label="Default text input" onChange={onChange} />;
	})
	.add('With default value', () => {
		return (
			<TextInput
				type="input"
				id="id1"
				label="Default text input"
				onChange={onChange}
				defaultValue="default text"
			/>
		);
	})
	.add('Optional', () => {
		return (
			<TextInput
				type="input"
				id="id2"
				label="Default optional text input"
				onChange={onChange}
				optional
			/>
		);
	})
	.add('Disabled', () => {
		return (
			<TextInput type="input" id="id3" label="Default text input" onChange={onChange} disabled />
		);
	})
	.add('Success', () => {
		return (
			<TextInput
				type="input"
				id="id4"
				label="Default text input"
				onChange={onChange}
				status={success}
			/>
		);
	})
	.add('Warning', () => {
		return (
			<TextInput
				type="input"
				id="id5"
				label="Default text input"
				onChange={onChange}
				status={warning}
			/>
		);
	})
	.add('Warning inside warning Fieldset', () => {
		return (
			<div className="usa-form">
				<FieldSet
					legend="Text inputs"
					status={warning}
					className="display-inline-block"
					id="example-fieldset-warning"
				>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<TextInput type="input" id="id6" label="Short" onChange={onChange} status={warning} />
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput type="input" id="id7" label="Long" onChange={onChange} status={warning} />
					</div>
				</FieldSet>
			</div>
		);
	})
	.add('Error', () => {
		return (
			<TextInput
				type="input"
				id="id8"
				label="Default text input"
				onChange={onChange}
				status={error}
			/>
		);
	})
	.add('Error inside error Fieldset', () => {
		return (
			<div className="usa-form">
				<FieldSet
					legend="Text inputs"
					status={error}
					className="display-inline-block"
					id="example-fieldset-error"
				>
					<div className="mobile-lg:grid-col-4 display-inline-block">
						<TextInput type="input" id="id9" label="Short" onChange={onChange} status={error} />
					</div>
					<div className="mobile-lg:grid-col-8 display-inline-block">
						<TextInput type="input" id="id10" label="Long" onChange={onChange} status={error} />
					</div>
				</FieldSet>
			</div>
		);
	});
