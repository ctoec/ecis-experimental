import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'react-dates/initialize';
import DatePicker from './DatePicker';
import moment from 'moment';

const onChange = action('onChange');
const dateRange = { startDate: moment('2019-10-30'), endDate: moment('2019-10-30') };

storiesOf('DatePicker', module)
	.add('Default', () => {
		return <DatePicker onChange={onChange} dateRange={dateRange} byRange={false} />;
	})
	.add('ByRange', () => {
		return <DatePicker onChange={onChange} dateRange={dateRange} byRange={true} />;
	});
