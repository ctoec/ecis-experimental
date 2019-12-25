import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import FieldSet, { FormError } from '../FieldSet/FieldSet';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

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

	// Make date picker take id value so people can add a label nearby?-- see enrollment use cases
	// Should we only use fieldset when it's a date range picker?
		// "Many assistive technologies will use the <legend> element as if it is a part of the label of each widget inside the corresponding <fieldset> element. For example, some screen readers such as Jaws or NVDA will speak the legend's content before speaking the label of each widget."

	// Also: accept people entering a date like 6/22/89

	// Override js defaults if necessary to assume 2000s rather than 1900s!

	// TODO: Make it so that user can optionally make calendar not show for things like birthdate?  But keep format for consistency's sake?

	// Date range input fields have aria label by default
	return (
		<FieldSet legend={legend} error={error} id={id}>
			{byRange && (
				<DateRangePicker
					startDate={selectedRange.startDate}
					startDateId="startDate"
					endDate={selectedRange.endDate}
					endDateId="endDate"
					focusedInput={datePickerFocused}
					onDatesChange={dates => setDateRange(dates)}
					onFocusChange={(focused: string | null) => setDatePickerFocused(focused)}
					isOutsideRange={date => isOutsidePossibleRange(date)}
					initialVisibleMonth={() => moment().subtract(1, 'M')}
				/>
			)}
			{!byRange && (
				<SingleDatePicker
					id="date"
					date={selectedRange.startDate}
					focused={datePickerFocused === 'startDate'}
					onDateChange={date => setDateRange({ startDate: date, endDate: date })}
					onFocusChange={({ focused }: any) => setDatePickerFocused(focused ? 'startDate' : null)}
					isOutsideRange={date => isOutsidePossibleRange(date)}
					initialVisibleMonth={() => moment().subtract(1, 'M')}
				/>
			)}
		</FieldSet>
	);
};

export default DatePicker;
