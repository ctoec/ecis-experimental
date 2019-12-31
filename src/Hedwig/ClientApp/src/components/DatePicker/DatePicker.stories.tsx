import React from 'react';
import moment from 'moment';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'react-dates/initialize';
import DatePicker from './DatePicker';
import { FormStatusProps } from '../FormStatus/FormStatus';

const onChange = action('onChange');
const dateRange = { startDate: moment('2019-10-30'), endDate: moment('2019-10-30') };
const label = 'Pick a date';
const error: FormStatusProps = {
	type: 'error',
	message: 'Pick a better date',
	id: 'datepicker-error',
};
const warning: FormStatusProps = {
	type: 'warning',
	message: 'Meh, fine',
	id: 'datepicker-warning',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'You did good',
	id: 'datepicker-success',
};

storiesOf('DatePicker', module)
	.add('Default', () => {
		return (
			<DatePicker label={label} onChange={onChange} dateRange={dateRange} id="default-datepicker" />
		);
	})
	.add('Range', () => {
		return (
			<DatePicker
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				format="rangeCalendar"
				id="byrange-datepicker"
			/>
		);
	})
	.add('Text input only', () => {
		return (
			<DatePicker
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				format="inputOnly"
				id="byrange-datepicker"
			/>
		);
	})
	.add('Optional', () => {
		return (
			<DatePicker
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				id="optional-datepicker"
				optional
			/>
		);
	})
	.add('Disabled', () => {
		return (
			<DatePicker
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				id="disabled-datepicker"
				disabled={true}
			/>
		);
	})
	.add('Disabled with range', () => {
		return (
			<DatePicker
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				format="rangeCalendar"
				id="disabled-range-datepicker"
				disabled={true}
			/>
		);
	})
	.add('Success', () => {
		return (
			<DatePicker
				label={label}
				id="error-datepicker"
				onChange={onChange}
				dateRange={dateRange}
				status={success}
			/>
		);
	})
	.add('Success with range', () => {
		return (
			<DatePicker
				label={label}
				id="error-datepicker"
				onChange={onChange}
				dateRange={dateRange}
				format="rangeCalendar"
				status={success}
			/>
		);
	})
	.add('Warning', () => {
		return (
			<DatePicker
				label={label}
				id="error-datepicker"
				onChange={onChange}
				dateRange={dateRange}
				status={warning}
			/>
		);
	})
	.add('Warning with range', () => {
		return (
			<DatePicker
				label={label}
				id="error-datepicker"
				onChange={onChange}
				dateRange={dateRange}
				format="rangeCalendar"
				status={warning}
			/>
		);
	})
	.add('Error', () => {
		return (
			<DatePicker
				label={label}
				id="error-datepicker"
				onChange={onChange}
				dateRange={dateRange}
				status={error}
			/>
		);
	})
	.add('Error with range', () => {
		return (
			<DatePicker
				label={label}
				id="error-datepicker"
				onChange={onChange}
				dateRange={dateRange}
				format="rangeCalendar"
				status={error}
			/>
		);
	});
