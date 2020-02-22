import React from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'react-dates/initialize';
import { DateRangeInput, FormStatusProps } from '..';

const onChange = action('onChange');
const dateRange = { startDate: moment('2019-10-30'), endDate: moment('2019-10-30') };
const label = 'Pick a date';
const error: FormStatusProps = {
	type: 'error',
	message: 'Pick a better date',
	id: 'range-input-error',
};
const warning: FormStatusProps = {
	type: 'warning',
	message: 'Meh, fine',
	id: 'range-input-warning',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'You did good',
	id: 'range-input-success',
};

storiesOf('DateRangeInput', module)
	.add('Default', () => {
		return (
			<DateRangeInput
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				id="default-DateRangeInput"
			/>
		);
	})
	.add('Optional', () => {
		return (
			<DateRangeInput
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				id="optional-DateRangeInput"
				optional={true}
			/>
		);
	})
	.add('Disabled', () => {
		return (
			<DateRangeInput
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				id="disabled-DateRangeInput"
				disabled={true}
			/>
		);
	})
	.add('Success', () => {
		return (
			<DateRangeInput
				label={label}
				id="error-DateRangeInput"
				onChange={onChange}
				dateRange={dateRange}
				status={success}
			/>
		);
	})
	.add('Warning', () => {
		return (
			<DateRangeInput
				label={label}
				id="error-DateRangeInput"
				onChange={onChange}
				dateRange={dateRange}
				status={warning}
			/>
		);
	})
	.add('Error', () => {
		return (
			<DateRangeInput
				label={label}
				id="error-DateRangeInput"
				onChange={onChange}
				dateRange={dateRange}
				status={error}
			/>
		);
	});
