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

	// TODO: Make date picker take id value so people can add a label nearby?-- see enrollment use cases
	// OR just include label here?  Or make fieldset legend look like a label in some cases, like this one?

	// TODO: Should we only use fieldset when it's a date range picker?

	// TODO: Accept people entering a date like 6/22/89

	// TODO: Override js defaults if necessary to assume 2000s rather than 1900s!

	// TODO: Make it so that user can optionally make calendar not show for things like birthdate?  But keep format for consistency's sake?

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
