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
			<DatePicker
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				byRange={false}
				id="default-datepicker"
			/>
		);
	})
	.add('ByRange', () => {
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
	.add('With error', () => {
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
