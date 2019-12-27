import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import FieldSet from '../FieldSet/FieldSet';
import FormError, { FormErrorProps } from '../FormError/FormError';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

type DatePickerProps = {
	dateRange: DateRange;
	onChange: (newRange: DateRange) => any;
	id: string;
	label: string | JSX.Element;
	disabled?: boolean;
	success?: boolean;
	error?: FormErrorProps;
	optional?: boolean;
	byRange?: boolean;
	possibleRange?: DateRange;
};

export const DatePicker: React.FC<DatePickerProps> = ({
	dateRange,
	onChange,
	id,
	label,
	disabled,
	success,
	error,
	optional,
	byRange,
	possibleRange,
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

	// TODO: Accept people entering a date like 6/22/89-- override js defaults if necessary to assume 2000s rather than 1900s!

	// TODO: Make it so that user can optionally make calendar not show for things like birthdate?  But keep format for consistency's sake?

	const labelText = `${label}${optional ? ' (Optional)' : ''}`;
	if (byRange) {
		return (
			<FieldSet legend={labelText} error={error} id={id} showLegend={true} success={success}>
				<DateRangePicker
					startDate={selectedRange.startDate}
					startDateId={`${id}-start-date`}
					endDate={selectedRange.endDate}
					endDateId={`${id}-end-date`}
					focusedInput={datePickerFocused}
					onDatesChange={dates => setDateRange(dates)}
					onFocusChange={(focused: string | null) => setDatePickerFocused(focused)}
					isOutsideRange={date => isOutsidePossibleRange(date)}
					initialVisibleMonth={() => moment().subtract(1, 'M')}
					noBorder={true}
					disabled={disabled}
				/>
			</FieldSet>
		);
	}
	return (
		<div className={`usa-form-group ${error ? ` usa-form-group--${error.type}` : ''}`}>
			<label
				className={`usa-label margin-top-0 ${error ? ` usa-label--${error.type}` : ''}`}
				htmlFor={`${id}-date`}
			>
				{labelText}
			</label>
			{error && <FormError {...error} />}
			<span
				className={`oec-date-input${error ? ` oec-date-input--${error.type}` : ''}${
					success ? ' oec-date-input--success' : ''
				}`}
			>
				<SingleDatePicker
					id={`${id}-date`}
					date={selectedRange.startDate}
					focused={datePickerFocused === 'startDate'}
					onDateChange={date => setDateRange({ startDate: date, endDate: date })}
					onFocusChange={({ focused }: any) => setDatePickerFocused(focused ? 'startDate' : null)}
					isOutsideRange={date => isOutsidePossibleRange(date)}
					initialVisibleMonth={() => moment().subtract(1, 'M')}
					noBorder={true}
					disabled={disabled}
				/>
			</span>
		</div>
	);
};

export default DatePicker;
