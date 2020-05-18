import React from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateInput, FormStatusProps } from '..';

const commonProps = {
	onChange: action('onChange'),
	label: 'Date',
	id: 'dateinput-example',
};
const commonPropsWithDefault = {
	...commonProps,
	defaultValue: new Date('2019-10-30'),
};
const error: FormStatusProps = {
	type: 'error',
	message: 'Pick a better date',
	id: 'DateInput-error',
};
const warning: FormStatusProps = {
	type: 'warning',
	message: 'Meh, fine',
	id: 'DateInput-warning',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'You did good',
	id: 'DateInput-success',
};

storiesOf('Date input', module)
	.add('Default with no date set', () => {
		return <DateInput {...commonProps} />;
	})
	.add('Default with date', () => {
		return <DateInput {...commonPropsWithDefault} />;
	})
	.add('Optional', () => {
		return <DateInput {...commonPropsWithDefault} optional={true} />;
	})
	.add('Disabled day input', () => {
		return <DateInput {...commonPropsWithDefault} disabled />;
	})
	.add('Success', () => {
		return <DateInput {...commonPropsWithDefault} status={success} />;
	})
	.add('Warning', () => {
		return <DateInput {...commonPropsWithDefault} status={warning} />;
	})
	.add('Error', () => {
		return <DateInput {...commonPropsWithDefault} status={error} />;
	});
