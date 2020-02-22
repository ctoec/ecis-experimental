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
	id: 'DateRangeInput-error',
};
const warning: FormStatusProps = {
	type: 'warning',
	message: 'Meh, fine',
	id: 'DateRangeInput-warning',
};
const success: FormStatusProps = {
	type: 'success',
	message: 'You did good',
	id: 'DateRangeInput-success',
};

storiesOf('DateRangeInput', module)
	.add('Default', () => {
		return (
			<DateRangeInput label={label} onChange={onChange} dateRange={dateRange} id="default-DateRangeInput" />
		);
	})
	.add('Range', () => {
		return (
			<DateRangeInput
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				byRange={true}
				id="byrange-DateRangeInput"
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
	.add('Disabled with range', () => {
		return (
			<DateRangeInput
				label={label}
				onChange={onChange}
				dateRange={dateRange}
				byRange={true}
				id="disabled-range-DateRangeInput"
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
	.add('Success with range', () => {
		return (
			<DateRangeInput
				label={label}
				id="error-DateRangeInput"
				onChange={onChange}
				dateRange={dateRange}
				byRange={true}
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
	.add('Warning with range', () => {
		return (
			<DateRangeInput
				label={label}
				id="error-DateRangeInput"
				onChange={onChange}
				dateRange={dateRange}
				byRange={true}
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
	})
	.add('Error with range', () => {
		return (
			<DateRangeInput
				label={label}
				id="error-DateRangeInput"
				onChange={onChange}
				dateRange={dateRange}
				byRange={true}
				status={error}
			/>
		);
	});
