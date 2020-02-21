import React, { useState, useEffect } from 'react';
import moment, { Moment } from 'moment';
import { DayPickerRangeController, DayPickerSingleDateController } from 'react-dates';
import { FieldSet, TextInput, FormStatusProps, Button } from '..';

type DateRange = {
	// TODO: do we want to deal exclusively in range or should we accept just a date too?  Should we make a separate range component?
	startDate: Moment | null;
	endDate: Moment | null;
};

type DateInputProps = {
	dateRange: DateRange;
	onChange: (newRange: DateRange) => void;
	id: string;
	label: string;
	format?: 'dayInput' | 'rangeInput';
	disabled?: boolean;
	optional?: boolean;
	status?: FormStatusProps;
	className?: string;
	hideLabel?: boolean;
	// Will only take effect on fieldsets-- otherwise we should not hide the label
};

const parseDateInput = (input?: string): Moment | null => {
	if (!input) return null;
	const acceptedDelimiters = ['-', '/', ' '];
	acceptedDelimiters.forEach(d => {
		const splitInput = input.split(d);
		if (splitInput.length === 3) {
			// For parsing consistency across browsers
			return moment(splitInput.join('-'), 'MM-DD-YYYY');
		}
	});
	return null;
};

export const DateInput: React.FC<DateInputProps> = ({
	dateRange,
	onChange,
	id,
	label,
	format = 'dayInput',
	disabled,
	optional,
	status,
	className,
}) => {
	// On text input blur, check for validity of date
	// Fire on change event either way?

	// On calendar click, fire on change event, which should also update text input
	// Make calendar dropdown optional

	// TODO: default to empty date-- what should happen?

	const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
	const [stringRange, setStringRange] = useState<{ startDate?: string; endDate?: string }>({
		startDate: dateRange.startDate ? dateRange.startDate.format('MM/DD/YYYY') : undefined,
		endDate: dateRange.endDate ? dateRange.endDate.format('DD/MM/YYYY') : undefined,
	});

	return (
		<FieldSet
			legend={label}
			id={`${id}-fieldset`}
			showLegend={format === 'rangeInput'}
			disabled={disabled}
			hint="For example: 04/28/1986"
			status={status}
			optional={optional}
		>
			{format === 'dayInput' && (
				<div className="grid-row flex-row flex-align-end grid-gap position-relative">
					<TextInput
						label={label}
						id={id}
						onChange={e => setStringRange({ startDate: e.target.value, endDate: e.target.value })}
						defaultValue={stringRange.startDate}
						onBlur={() => {
							const parsedInput = parseDateInput(stringRange.startDate);
							onChange({ startDate: parsedInput, endDate: parsedInput });
						}}
					/>
					<div>
						<Button text={'Calendar'} onClick={() => setCalendarOpen(!calendarOpen)} />
						{calendarOpen && (
							<div className="position-absolute z-top">
								<DayPickerSingleDateController
									date={dateRange.startDate}
									onDateChange={newDate => onChange({ startDate: newDate, endDate: newDate })}
									focused={calendarOpen || false}
									// Annoyingly this does not do anything for keyboard users
									onFocusChange={f => setCalendarOpen(f.focused || false)}
									onOutsideClick={(e) => {
										const targetText = e.target.innerHTML;
										if (targetText!== 'Calendar') {
											setCalendarOpen(false)
										}
									}}
								/>
							</div>
						)}
					</div>
				</div>
			)}
			{/* {format === 'rangeInput' && (
				// TODO: if line must break then arrow is on first line and calendar is on second
				<>
					<TextInput label="Start date" id={`${id}-start`} />
					<span>TODO: PUT AN ARROW HERE</span>
					<TextInput label="End date" id={`${id}-end`} />
					<DayPickerRangeController
						startDate={dateRange.startDate}
						endDate={dateRange.endDate}
						onDatesChange={onChange}
						focusedInput={calendarOpen}
						onFocusChange={setCalendarOpen}
					/>
				</>
			)} */}
		</FieldSet>
	);
};
