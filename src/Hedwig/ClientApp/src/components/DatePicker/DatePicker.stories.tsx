import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import 'react-dates/initialize';
import DatePicker from './DatePicker';
import getDefaultDateRange from '../../utils/getDefaultDateRange';

const onChange = action('onChange');
const dateRange = getDefaultDateRange();

storiesOf('DatePicker', module)
	.add('Default', () => {
		return <DatePicker onChange={onChange} dateRange={dateRange} byRange={false} />;
	})
	.add('ByRange', () => {
		return <DatePicker onChange={onChange} dateRange={dateRange} byRange={true} />;
	});
