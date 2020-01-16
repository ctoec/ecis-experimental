import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import { FieldSet, FormStatus, FormStatusProps } from '..';

export type MomentDateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
	startDateInvalid?: boolean;
	endDateInvalid?: boolean;
};

type DatePickerProps = {
	dateRange: MomentDateRange;
	onChange: (newRange: MomentDateRange) => any;
	id: string;
	label: string;
	disabled?: boolean;
	status?: FormStatusProps;
	optional?: boolean;
	byRange?: boolean;
	possibleRange?: MomentDateRange;
	className?: string;
};

export const DatePicker: React.FC<DatePickerProps> = ({
	dateRange,
	onChange,
	id,
	label,
	disabled,
	status: inputStatus,
	optional,
	byRange,
	possibleRange,
	className,
}) => {
	const [selectedRange, setSelectedRange] = useState(dateRange);
	const [datePickerFocused, setDatePickerFocused] = useState();

	function setDateRange(input: MomentDateRange) {
		const startDateInvalid = !input.startDate || !input.startDate.isValid();
		const endDateInvalid = !input.endDate || !input.endDate.isValid();
		setSelectedRange({ ...input, startDateInvalid, endDateInvalid });
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

	// TODO: revisit usage of this datepicker library at all-- can't add aria-describedby :/

	let status = inputStatus;
	if (
		datePickerFocused === null &&
		!inputStatus &&
		(selectedRange.startDateInvalid || selectedRange.endDateInvalid)
	) {
		status = { type: 'warning', id: `${id}-warning`, message: 'Date format must be MM/DD/YYYY' };
	}

	const hint = `For example: 04/28/1986${optional ? ' (optional)' : ''}`;
	const initialVisibleMonth = selectedRange.startDate || moment();

	if (byRange) {
		return (
			<FieldSet
				legend={label}
				status={status}
				id={id}
				showLegend={true}
				hint={hint}
				optional={optional}
			>
				<DateRangePicker
					startDate={selectedRange.startDate}
					startDateId={`${id}-start-date`}
					endDate={selectedRange.endDate}
					endDateId={`${id}-end-date`}
					focusedInput={datePickerFocused}
					onDatesChange={dates => setDateRange(dates)}
					onFocusChange={(focused: string | null) => setDatePickerFocused(focused)}
					isOutsideRange={date => isOutsidePossibleRange(date)}
					initialVisibleMonth={() => initialVisibleMonth}
					noBorder={true}
					disabled={disabled}
				/>
			</FieldSet>
		);
	}
	return (
		<div
			className={`${className || ''} usa-form-group ${
				status ? ` usa-form-group--${status.type}` : ''
			}`}
		>
			<label
				className={`usa-label ${status ? ` usa-label--${status.type}` : ''}`}
				htmlFor={`${id}-date`}
			>
				{label}
			</label>
			<span className="usa-hint text-italic display-block">{hint}</span>
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
					initialVisibleMonth={() => initialVisibleMonth}
					numberOfMonths={1}
					noBorder={true}
					disabled={disabled}
				/>
			</span>
		</div>
	);
};
