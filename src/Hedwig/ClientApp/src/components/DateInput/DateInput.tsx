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
	startIsInvalid?: boolean;
	endIsInvalid?: boolean;
	start?: undefined | string;
	end?: undefined | string;
	errorMessage: string;
};

type inputDetailsType = { [key: string]: inputDetailType };

type DateInputProps = {
	dateRange: DateRange;
	onChange: (newRange: DateRange) => void;
	id: string;
	label: string | JSX.Element;
	format?: 'dayInput' | 'rangeInput';
	disabled?: boolean;
	status?: FormStatusProps;
	hideLabel?: boolean;
	// Will only take effect on fieldsets-- otherwise we should not hide the label
};

export const DateInput: React.FC<DateInputProps> = ({
	dateRange,
	onChange,
	id,
	label,
	format = 'dayInput',
	disabled,
	status,
	hideLabel,
}) => {
	const [selectedRange, setSelectedRange] = useState(dateRange);

	const [inputDetails, setInputDetails] = useState<inputDetailsType>({
		month: {
			props: {
				inputProps: { maxLength: 2, type: 'number', min: 1, max: 12 },
				label: 'Month',
			},
			parseMoment: (inputMoment: Moment | null) =>
				inputMoment ? inputMoment.format('MM') : undefined,
			checkValidity: value => +value > 0 && +value < 13,
			errorMessage: 'Invalid month',
			className: 'usa-form-group--month'
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
			className: 'usa-form-group--day'
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
			className: 'usa-form-group--year',
		},
	});

	// Add warning that date isn't valid if it isn't?
	useEffect(() => {
		const newStart = moment(
			`${inputDetails.year.start}-${inputDetails.month.start}-${inputDetails.day.start}`,
			'YYYY-MM-DD'
		);
		let newEnd = newStart;
		if (format === 'rangeInput') {
			newEnd = moment(
				`${inputDetails.year.end}-${inputDetails.month.end}-${inputDetails.day.end}`,
				'YYYY-MM-DD'
			);
		}
		setSelectedRange({ startDate: newStart, endDate: newEnd });
		onChange(selectedRange);
	}, [inputDetails]);

	// TODO: implement "optional" styling for fieldset

	const commonDateInputProps = {
		className: 'oec-date-input__input margin-left-0',
		disabled: disabled,
		type: 'number',
		inline: true,
	};

	const startDateFieldset = (
		<FieldSet
			legend={`${label} start`}
			id={`${id}-start-date`}
			showLegend
			className="flex-row display-flex flex-align-end usa-memorable-date"
		>
			{Object.keys(inputDetails).map(key => (
				<TextInput
					key={key}
					defaultValue={inputDetails[key].start}
					onChange={event => {
						const newInputDetails = Object.assign({}, inputDetails);
						newInputDetails[key].start = event.target.value;
						setInputDetails(newInputDetails);
					}}
					id={`${id}-${key}-start-date`}
					{...inputDetails[key].props}
					{...commonDateInputProps}
					onBlur={event => {
						const newInputDetails = Object.assign({}, inputDetails);
						newInputDetails[key].startIsInvalid = !inputDetails[key].checkValidity(
							event.target.value
						);
						setInputDetails(newInputDetails);
					}}
					status={
						inputDetails[key].startIsInvalid
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
				status={status}
				id={id}
				showLegend={!hideLabel}
				hint="For example: 04 28 1986"
				className="flex-row display-flex flex-align-end"
			>
				{startDateFieldset}
				<FieldSet
					legend={`${label} end`}
					id={`${id}-end-date`}
					showLegend
					className="flex-row display-flex flex-align-end usa-memorable-date"
				>
					{Object.keys(inputDetails).map(key => (
						<TextInput
							key={key}
							defaultValue={inputDetails[key].end}
							onChange={event => {
								const newInputDetails = Object.assign({}, inputDetails);
								newInputDetails[key].end = event.target.value;
								setInputDetails(newInputDetails);
							}}
							id={`${id}-${key}-end-date`}
							{...inputDetails[key].props}
							{...commonDateInputProps}
							onBlur={event => {
								const newInputDetails = Object.assign({}, inputDetails);
								newInputDetails[key].endIsInvalid = !inputDetails[key].checkValidity(
									event.target.value
								);
								setInputDetails(newInputDetails);
							}}
							status={
								inputDetails[key].endIsInvalid
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
