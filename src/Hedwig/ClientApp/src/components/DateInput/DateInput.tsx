import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import FieldSet from '../FieldSet/FieldSet';
import TextInput from '../TextInput/TextInput';
import { FormStatusProps } from '../FormStatus/FormStatus';

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
	checkValidity: (value: any) => boolean;
	errorMessage: string;
};

type inputDetailsType = { [key: string]: inputDetailType };

type rangeValType = {
	start?: string;
	end?: string;
	startIsInvalid?: boolean;
	endIsInvalid?: boolean;
};

type rangeByValType = { [key: string]: rangeValType };

type DateInputProps = {
	dateRange: DateRange;
	onChange: (newRange: DateRange) => void;
	id: string;
	label: string;
	format?: 'dayInput' | 'rangeInput';
	disabled?: boolean;
	status?: FormStatusProps;
	className?: string;
	hideLabel?: boolean;
	// Will only take effect on fieldsets-- otherwise we should not hide the label
};

const inputDetails: inputDetailsType = {
	month: {
		props: {
			inputProps: { maxLength: 2, type: 'number', min: 1, max: 12 },
			label: 'Month',
		},
		parseMoment: (inputMoment: Moment | null) =>
			inputMoment ? inputMoment.format('MM') : undefined,
		checkValidity: value => +value > 0 && +value < 13,
		errorMessage: 'Invalid month',
	},
	day: {
		props: {
			label: 'Day',
			inputProps: { maxLength: 2, type: 'number', min: 1, max: 31 },
		},
		parseMoment: (inputMoment: Moment | null) =>
			inputMoment ? inputMoment.format('DD') : undefined,
		checkValidity: value => +value < 32 && +value > 0,
		errorMessage: 'Invalid day',
	},
	year: {
		props: {
			label: 'Year',
			inputProps: { maxLength: 4, type: 'number', min: 1990, max: 2100 },
		},
		parseMoment: (inputMoment: Moment | null) =>
			inputMoment ? inputMoment.format('YYYY') : undefined,
		checkValidity: value =>
			value.length === 2 || (value.length === 4 && +value > 1989 && +value < 2101),
		errorMessage: 'Invalid year',
	},
};

export const DateInput: React.FC<DateInputProps> = ({
	dateRange,
	onChange,
	id,
	label,
	format = 'dayInput',
	disabled,
	status,
	className,
	hideLabel,
}) => {
	const initialRangeByVal: rangeByValType = {};
	Object.keys(inputDetails).forEach(dateItem => {
		initialRangeByVal[dateItem] = {};
		initialRangeByVal[dateItem].start = inputDetails[dateItem].parseMoment(dateRange.startDate);
		initialRangeByVal[dateItem].end = inputDetails[dateItem].parseMoment(dateRange.endDate);
	});
	
	const [rangeByVal, setRangeByVal] = useState<rangeByValType>(initialRangeByVal);

	// Add warning that date isn't valid if it isn't?
	useEffect(() => {
		const newStart = moment(
			`${rangeByVal.year.start}-${rangeByVal.month.start}-${rangeByVal.day.start}`,
			'YYYY-MM-DD'
		);
		let newEnd = newStart;
		if (format === 'rangeInput') {
			newEnd = moment(
				`${rangeByVal.year.end}-${rangeByVal.month.end}-${rangeByVal.day.end}`,
				'YYYY-MM-DD'
			);
		}
		onChange({ startDate: newStart, endDate: newEnd });
	}, [rangeByVal]);

	// TODO: implement "optional" styling for fieldset

	const commonDateInputProps = {
		className: 'oec-date-input__input',
		disabled: disabled,
		type: 'number',
		inline: true,
	};

	const showInlineWarning = !status && Object.keys(rangeByVal).find(
		dateItem => rangeByVal[dateItem].startIsInvalid || rangeByVal[dateItem].endIsInvalid
	);
	const inlineWarning: FormStatusProps | undefined = showInlineWarning ? { type: 'warning', id: 'invalid-date-field' } : undefined;

	const startDateFieldset = (
		<FieldSet
			legend={format === 'rangeInput' ? `${label} start` : label}
			id={`${id}-start-date`}
			showLegend={format === 'rangeInput' ? true : !hideLabel}
			hint={format !== 'rangeInput' ? 'For example: 04 28 1986' : ''}
			childrenGroupClassName="flex-row flex-align-end usa-memorable-date"
			className={className}
			status={format === 'rangeInput' ? undefined : (status || inlineWarning)}
		>
			{Object.keys(inputDetails).map(key => (
				<TextInput
					key={key}
					defaultValue={rangeByVal[key].start}
					onChange={event => {
						const newRangeVals = Object.assign({}, rangeByVal);
						newRangeVals[key].start = event.target.value;
						setRangeByVal(newRangeVals);
					}}
					id={`${id}-${key}-start-date`}
					{...inputDetails[key].props}
					{...commonDateInputProps}
					onBlur={event => {
						const newRangeVals = Object.assign({}, rangeByVal);
						newRangeVals[key].startIsInvalid = !inputDetails[key].checkValidity(event.target.value);
						setRangeByVal(newRangeVals);
					}}
					status={
						rangeByVal[key].startIsInvalid
							? {
									type: 'warning',
									message: inputDetails[key].errorMessage,
									id: `${id}-${key}-start-error`,
							  }
							: undefined
					}
				/>
			))}{' '}
		</FieldSet>
	);

	if (format === 'rangeInput') {
		return (
			<FieldSet
				legend={label}
				status={status || inlineWarning}
				id={id}
				showLegend={!hideLabel}
				hint="For example: 04 28 1986"
				childrenGroupClassName="flex-row display-flex flex-align-end"
				className={className}
			>
				{startDateFieldset}
				<FieldSet
					legend={`${label} end`}
					id={`${id}-end-date`}
					showLegend
					childrenGroupClassName="flex-row flex-align-end usa-memorable-date"
				>
					{Object.keys(inputDetails).map(key => (
						<TextInput
							key={key}
							defaultValue={rangeByVal[key].end}
							onChange={event => {
								const newRangeVals = Object.assign({}, rangeByVal);
								newRangeVals[key].end = event.target.value;
								setRangeByVal(newRangeVals);
							}}
							id={`${id}-${key}-end-date`}
							{...inputDetails[key].props}
							{...commonDateInputProps}
							onBlur={event => {
								const newRangeVals = Object.assign({}, rangeByVal);
								newRangeVals[key].endIsInvalid = !inputDetails[key].checkValidity(
									event.target.value
								);
								setRangeByVal(newRangeVals);
							}}
							status={
								rangeByVal[key].endIsInvalid
									? {
											type: 'warning',
											message: inputDetails[key].errorMessage,
											id: `${id}-${key}-start-error`,
									  }
									: undefined
							}
						/>
					))}
				</FieldSet>
			</FieldSet>
		);
	}
	return startDateFieldset;
};

export default DateInput;
