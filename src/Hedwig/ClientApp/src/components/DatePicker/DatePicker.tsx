import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import FieldSet from '../FieldSet/FieldSet';
import TextInput from '../TextInput/TextInput';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

type DatePickerProps = {
	dateRange: DateRange;
	onChange: (newRange: DateRange) => any;
	id: string;
	label: string | JSX.Element;
	format?: 'rangeCalendar' | 'dayCalendar' | 'inputOnly';
	disabled?: boolean;
	status?: FormStatusProps;
	optional?: boolean;
	possibleRange?: DateRange;
	hideLabel?: boolean; // Will only take effect on fieldsets-- otherwise we should not hide the label
};

type SeparatedDate = {
	month: number;
	day: number;
	year: number;
};

export const DatePicker: React.FC<DatePickerProps> = ({
	dateRange,
	onChange,
	id,
	label,
	format = 'dayCalendar',
	disabled,
	status,
	possibleRange,
	hideLabel,
}) => {
	const [selectedRange, setSelectedRange] = useState(dateRange);
	const [datePickerFocused, setDatePickerFocused] = useState();
	const [separatedStartDate, setSeparatedStartDate] = useState();
	const [separatedEndDate, setSeparatedEndDate] = useState();

	function setDateRange(input: DateRange) {
		console.log(input);
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

	// OnChange-- do it one input box at a time?  Autofocus?  Research this
	// TODO: Accept people entering a date like 6/22/89-- override js defaults if necessary to assume 2000s rather than 1900s!
	// TODO: revisit usage of this datepicker library at all-- can't add aria-describedby :/

	if (format === 'inputOnly') {
		return (
			<FieldSet legend={label} status={status} id={id} showLegend={!hideLabel}>
				<TextInput
					label="Month"
					onChange={() => {}}
					id={`${id}-month`}
					small
					className="display-inline"
					inputProps={{ maxLength: 2, type: 'number', min: 1, max: 12 }}
				/>
				<TextInput
					label="Day"
					onChange={() => {}}
					id={`${id}-day`}
					small
					className="display-inline"
					inputProps={{ maxLength: 2, type: 'number', min: 1, max: 31 }}
				/>
				<TextInput
					label="Year"
					onChange={() => {}}
					id={`${id}-year`}
					className="display-inline"
					inputProps={{ maxLength: 4, type: 'number', min: 1990, max: 2100 }}
				/>
			</FieldSet>
		);
	}

	if (format === 'rangeCalendar') {
		return (
			<FieldSet legend={label} status={status} id={id} showLegend={!hideLabel}>
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
					numberOfMonths={1}
					noBorder={true}
					disabled={disabled}
				/>
			</FieldSet>
		);
	}
	return (
		<div className={`usa-form-group ${status ? ` usa-form-group--${status.type}` : ''}`}>
			<label
				className={`usa-label margin-top-0 ${status ? ` usa-label--${status.type}` : ''}`}
				htmlFor={`${id}-date`}
			>
				{label}
			</label>
			{status && status.message && <FormStatus {...status} />}
			<span
				className={`oec-date-input${status ? ` oec-date-input--${status.type}` : ''}`}
				aria-describedby={status ? status.id : undefined}
			>
				<SingleDatePicker
					id={`${id}-date`}
					date={selectedRange.startDate}
					focused={datePickerFocused === 'startDate'}
					onDateChange={date => setDateRange({ startDate: date, endDate: date })}
					onFocusChange={({ focused }: any) => setDatePickerFocused(focused ? 'startDate' : null)}
					isOutsideRange={date => isOutsidePossibleRange(date)}
					initialVisibleMonth={() => moment().subtract(1, 'M')}
					numberOfMonths={1}
					noBorder={true}
					disabled={disabled}
				/>
			</span>
		</div>
	);
};

export default DatePicker;
