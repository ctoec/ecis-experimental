import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import FormGroup, { FormError } from '../FormGroup/FormGroup';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

// TODO: make label required, make legend required if byrange is true
type DatePickerProps = {
	onChange: (newRange: DateRange) => any;
	dateRange: DateRange;
	legend: string;
	id: string;
	byRange?: boolean;
	possibleRange?: DateRange;
	error?: FormError;
};

export const DatePicker: React.FC<DatePickerProps> = ({
	dateRange,
	onChange,
	legend,
	id,
	byRange,
	possibleRange,
	error,
}) => {
	const [selectedRange, setSelectedRange] = useState(dateRange);
	const [datePickerFocused, setDatePickerFocused] = useState();

	function setDateRange(input: DateRange) {
		setSelectedRange(input);
		onChange(input);
	}

	function isOutsidePossibleRange(candidateDate: Moment) {
		if (!possibleRange) {
			return false;
		}
		const { startDate, endDate } = possibleRange;
		if (startDate && candidateDate.isBefore(startDate)) {
			return true;
		}
		if (endDate && candidateDate.isAfter(endDate)) {
			return true;
		}
		return false;
	}

	// TODO: include label here regardless, but take an element if someone prefers to give it a header
	// TODO: Make placeholder text mm/dd/yyyy, fill in one space at a time, and add error when it's not a valid date?
	// TODO: Make it so that user can optionally make calendar dropdown not show for things like birthdate

	if (byRange) {
		return (
			<FormGroup legend={legend} error={error} id={id}>
				<DateRangePicker
					startDate={selectedRange.startDate}
					endDate={selectedRange.endDate}
					startDateId={`${id}-start-date`}
					endDateId={`${id}-end-date`}
					focusedInput={datePickerFocused}
					onDatesChange={dates => setDateRange(dates)}
					onFocusChange={(focused: string | null) => setDatePickerFocused(focused)}
					isOutsideRange={date => isOutsidePossibleRange(date)}
					initialVisibleMonth={() => moment().subtract(1, 'M')}
				/>
			</FormGroup>
		);
	}
	return (
		<SingleDatePicker
			date={selectedRange.startDate}
			id={`single-date-${id}`}
			focused={datePickerFocused === 'startDate'}
			onDateChange={date => setDateRange({ startDate: date, endDate: date })}
			onFocusChange={({ focused }: any) => setDatePickerFocused(focused ? 'startDate' : null)}
			isOutsideRange={date => isOutsidePossibleRange(date)}
			initialVisibleMonth={() => moment().subtract(1, 'M')}
		/>
	);
};

export default DatePicker;
