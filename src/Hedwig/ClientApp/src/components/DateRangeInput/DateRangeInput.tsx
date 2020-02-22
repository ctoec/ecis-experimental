import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { FieldSet, TextInput, FormStatusProps, DateInput, DateInputProps } from '..';

export type DateRange = {
	startDate: Moment | null;
	endDate: Moment | null;
};

type DateRangeInputProps = Omit<DateInputProps, 'onChange'> & {
	dateRange: DateRange;
	onChange: (newDateRange: DateRange | null) => void;
	possibleRange?: DateRange;
	date?: never;
};

export const DateRangeInput: React.FC<DateRangeInputProps> = ({
	dateRange,
	possibleRange,
	onChange,
	id,
	label,
	disabled,
	optional,
	status,
	className,
	hideLabel,
}) => {
	return (
		<FieldSet
			legend={label}
			id={`${id}-outer-fieldset`}
			disabled={disabled}
			hint="For example: 04/28/1986"
			showLegend={!hideLabel}
			optional={optional}
		>
			<DateInput
				hideHint
				hideLabel
				date={dateRange.startDate}
				onChange={newStartDate => onChange({ startDate: newStartDate, endDate: dateRange.endDate })}
				id={`${id}-start-date`}
				label="Start date"
			/>
			<span>PUT ARROW HERE</span>
			<DateInput
				hideHint
				hideLabel
				date={dateRange.endDate}
				onChange={newEndDate => onChange({ startDate: dateRange.startDate, endDate: newEndDate })}
				id={`${id}-end-date`}
				label="End date"
			/>
		</FieldSet>
	);
};
