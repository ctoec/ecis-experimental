import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import { DateRangePicker, SingleDatePicker } from 'react-dates';
import FieldSet from '../FieldSet/FieldSet';
import TextInput from '../TextInput/TextInput';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

// TODO: maybe ditch the calendar datepicker if we're not actually using it

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

type inputDetailType = {
	props: {
		label: string;
		inputProps: any;
	};
	parseMoment: (inputMoment: Moment | null) => string | undefined;
	isValid: (value: string) => boolean;
	start?: undefined | string;
	startSetter?: any | undefined; // TODO: REAL TYPE-- STATE OR WHATEVER
	end?: undefined | string;
	endSetter?: any;
};

type inputDetailsType = { [key: string]: inputDetailType };

type DatePickerProps = {
	dateRange: DateRange;
	onChange: (newRange: DateRange) => void;
	id: string;
	label: string | JSX.Element;
	format: 'rangeCalendar' | 'dayCalendar' | 'dayInput' | 'rangeInput';
	onBlur?: (currentProps: DatePickerProps) => void;
	disabled?: boolean;
	status?: FormStatusProps;
	possibleRange?: DateRange;
	hideLabel?: boolean;
	// Will only take effect on fieldsets-- otherwise we should not hide the label
};

export const DatePicker: React.FC<DatePickerProps> = ({
	dateRange,
	onChange,
	id,
	label,
	format,
	onBlur,
	disabled,
	status,
	possibleRange,
	hideLabel,
}) => {
	const [selectedRange, setSelectedRange] = useState(dateRange);
	const [datePickerFocused, setDatePickerFocused] = useState<'startDate' | 'endDate' | null>(null);

	const inputDetails: inputDetailsType = {
		day: {
			props: {
				label: 'Day',
				inputProps: { maxLength: 2, type: 'number', min: 1, max: 31 },
			},
			parseMoment: (inputMoment: Moment | null) =>
				inputMoment ? inputMoment.format('DD') : undefined,
			isValid: value => +value < 32 && +value > 0,
		},
		year: {
			props: {
				label: 'Year',
				inputProps: { maxLength: 4, type: 'number', min: 1990, max: 2100 },
			},
			parseMoment: (inputMoment: Moment | null) =>
				inputMoment ? inputMoment.format('YYYY') : undefined,
			isValid: value =>
				value.length === 2 || (value.length === 4 && +value > 1989 && +value < 2101),
		},
		month: {
			props: {
				inputProps: { maxLength: 2, type: 'number', min: 1, max: 12 },
				label: 'Month',
			},
			parseMoment: (inputMoment: Moment | null) =>
				inputMoment ? inputMoment.format('MM') : undefined,
			isValid: value => +value > 0 && +value < 13,
		},
	};

	Object.keys(inputDetails).forEach(key => {
		const inputDetail = inputDetails[key];
		const [startVal, startSetter] = useState<string | undefined>(
			inputDetails[key].parseMoment(dateRange.startDate)
		);
		const [endVal, endSetter] = useState<string | undefined>(
			inputDetails[key].parseMoment(dateRange.startDate)
		);
		inputDetail.start = startVal;
		inputDetail.startSetter = startSetter;
		inputDetail.end = endVal;
		inputDetail.endSetter = endSetter;
	});

	function setDateRange(input: DateRange | null) {
		// TODO: validate input-- if it's not a valid moment, add a status??
		if (input === null) {
			return;
		}
		const startDateValid = input.startDate.isValid();
		const endDateIsValid = input.endDate.isValid();
		// TODO: if one of them is not valid, set the other one? show an error?

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
	if (format === 'dayCalendar') {
		return (
			<div className={`usa-form-group ${status ? ` usa-form-group--${status.type}` : ''}`}>
				<label
					className={`usa-label margin-top-0 ${status ? ` usa-label--${status.type}` : ''}`}
					htmlFor={`${id}-date`}
				>
					{label}
				</label>
				{status && <FormStatus {...status} />}
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
	}
	// OnChange-- do it one input box at a time?  Autofocus?  Research this
	// TODO: Accept people entering a date like 6/22/89-- override js defaults if necessary to assume 2000s rather than 1900s!
	// TODO: revisit usage of this datepicker library at all-- can't add aria-describedby :/
	// TODO: implement optional styling for fieldset

	const commonDateInputProps = {
		small: true,
		className: 'display-inline',
		disabled: disabled,
	};

	if (format === 'rangeInput') {
		return (
			<FieldSet legend={label} status={status} id={id} showLegend={!hideLabel}>
				<FieldSet legend={`${label} start`} id={`${id}-start-date`} showLegend>
					{Object.keys(inputDetails).map(key => (
						<TextInput
							defaultValue={inputDetails[key].start}
							onChange={event => inputDetails[key].startSetter(event.target.value)}
							id={`${id}-${key}-start-date`}
							{...inputDetails[key].props}
							{...commonDateInputProps}
						/>
					))}{' '}
				</FieldSet>
				<FieldSet legend={`${label} end`} id={`${id}-end-date`} showLegend>
					{Object.keys(inputDetails).map(key => (
						<TextInput
							defaultValue={inputDetails[key].end}
							onChange={event => inputDetails[key].endSetter(event.target.value)}
							id={`${id}-${key}-end-date`}
							{...inputDetails[key].props}
							{...commonDateInputProps}
						/>
					))}
				</FieldSet>
			</FieldSet>
		);
	}
	return (
		<FieldSet legend={label} id={id} status={status} showLegend={!hideLabel}>
			{Object.keys(inputDetails).map(key => (
				<TextInput
					defaultValue={inputDetails[key].start}
					onChange={event => inputDetails[key].startSetter(event.target.value)}
					id={`${id}-${key}-start-date`}
					{...inputDetails[key].props}
				/>
			))}
		</FieldSet>
	);
};

export default DatePicker;
