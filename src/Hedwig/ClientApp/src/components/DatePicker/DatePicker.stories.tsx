import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import moment from 'moment';
import 'react-dates/initialize';
import DatePicker from './DatePicker';

const onSubmit = action('onSubmit');
const onReset = action('onClick');
const now = moment().local();
const dateRange = { startDate: now, endDate: now };

storiesOf('DatePicker', module)
	.add('Default', () => {
		return (
			<DatePicker onSubmit={onSubmit} onReset={onReset} dateRange={dateRange} byRange={false} />
		);
	})
	.add('ByRange', () => {
		return (
			<DatePicker onSubmit={onSubmit} onReset={onReset} dateRange={dateRange} byRange={true} />
		);
	});
