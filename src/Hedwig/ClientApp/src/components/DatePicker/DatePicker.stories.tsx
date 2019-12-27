import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'react-dates/initialize';
import DatePicker from './DatePicker';
import moment from 'moment';

const onChange = action('onChange');
const dateRange = { startDate: moment('2019-10-30'), endDate: moment('2019-10-30') };
const label = 'Pick a date';

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
				byRange={true}
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
				optional={true}
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
				byRange={true}
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
				success={true}
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
				byRange={true}
				error={{ type: 'success', message: 'You did good' }}
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
				error={{ type: 'warning', message: 'Meh, fine' }}
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
				byRange={true}
				error={{ type: 'warning', message: 'Meh, fine' }}
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
				error={{ type: 'error', message: 'Pick a better date' }}
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
				byRange={true}
				error={{ type: 'error', message: 'Pick a better date' }}
			/>
		);
	});
