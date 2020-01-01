import React, { useState } from 'react';
import moment, { Moment } from 'moment';
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

type DateInputProps = {
	dateRange: DateRange;
	onChange: (newRange: DateRange) => void;
	id: string;
	label: string | JSX.Element;
	format: 'dayInput' | 'rangeInput';
	onBlur?: (currentProps: DateInputProps) => void;
	disabled?: boolean;
	status?: FormStatusProps;
	possibleRange?: DateRange;
	hideLabel?: boolean;
	// Will only take effect on fieldsets-- otherwise we should not hide the label
};

export const DateInput: React.FC<DateInputProps> = ({
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
  const [DateInputFocused, setDateInputFocused] = useState<'startDate' | 'endDate' | null>(null);
  
  // TODO: use effect, listen to each of the values, try to set date range on change

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
    // UUUUGH can't use hook here
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
	// TODO: implement "optional" styling for fieldset

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
					{...commonDateInputProps}
				/>
			))}
		</FieldSet>
	);
};

export default DateInput;
