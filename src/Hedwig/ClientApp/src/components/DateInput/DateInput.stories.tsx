import React from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'react-dates/initialize';
import { DateInput, FormStatusProps } from '..';

const commonProps = {
	onChange: action('onChange'),
	date: moment('2019-10-30'),
	label: 'Date',
	id: 'dateinput-example',
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
	.add('Default', () => {
		return <DateInput {...commonProps} />;
	})
	// .add('Range input', () => {
	// 	return <DateInput {...commonProps} format="rangeInput" />;
	// })
	// .add('Optional', () => {
	// 	return (
	// 		<DateInput
	// 			label={label}
	// 			onChange={onChange}
	// 			dateRange={dateRange}
	// 			id="optional-DateInput"
	// 			optional={true}
	// 		/>
	// 	);
	// })
	.add('Disabled day input', () => {
		return <DateInput {...commonProps} disabled />;
	})
	// .add('Disabled range input', () => {
	// 	return <DateInput {...commonProps} disabled format="rangeInput" />;
	// })
	.add('Success', () => {
		return <DateInput {...commonProps} status={success} />;
	})
	// .add('Success with range', () => {
	// 	return <DateInput {...commonProps} format="rangeInput" status={success} />;
	// })
	.add('Warning', () => {
		return <DateInput {...commonProps} status={warning} />;
	})
	// .add('Warning with range', () => {
	// 	return <DateInput {...commonProps} format="rangeInput" status={warning} />;
	// })
	.add('Error', () => {
		return <DateInput {...commonProps} status={error} />;
	})
	// .add('Error with range', () => {
	// 	return <DateInput {...commonProps} disabled format="rangeInput" status={error} />;
	// });
