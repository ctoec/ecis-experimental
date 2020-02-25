import React, { useState } from 'react';
import moment, { Moment } from 'moment';
import cx from 'classnames';
import { DayPickerSingleDateController } from 'react-dates';
import { FieldSet, TextInput, FormStatusProps, Button } from '..';
import { ReactComponent as CalendarIcon } from '../../assets/images/calendar.svg';
import { InputField } from '../../utils/forms/form';

export type DateInputProps = {
	// Is this too tightly coupled with our utils/specific use case?
	onChange: (newDate: InputField<Moment | null>) => any | void;
	id: string;
	label: string;
	date?: Moment | null;
	disabled?: boolean;
	optional?: boolean;
	status?: FormStatusProps;
	className?: string;
	hideLabel?: boolean;
	hideHint?: boolean;
	name?: string;
};

// TODO: MOVE TO UTIL
const parseDateInput = (input?: string): Moment | null => {
	let parsedInput = null;
	if (input) {
		const acceptedDelimiters = ['-', '/', ' '];
		acceptedDelimiters.forEach(d => {
			const splitInput = input.split(d);
			if (splitInput.length === 3) {
				// For parsing consistency across browsers
				parsedInput = moment(splitInput.join('-'), 'MM-DD-YYYY');
			}
		});
	}
	return parsedInput;
};

const momentFormat = 'MM/DD/YYYY'

export const DateInput: React.FC<DateInputProps> = ({
	date = null,
	onChange,
	id,
	label,
	disabled,
	optional,
	status,
	className,
	hideHint = false,
	name,
}) => {
	// TODO: default to empty date-- what should happen?

	const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
	const [currentDate, setCurrentDate] = useState(date);
	const [stringDate, setStringDate] = useState<string | undefined>(
		currentDate ? currentDate.format(momentFormat) : undefined
	);

	const onChangeEvent = (input: Moment | null) => {
		const notNullInput = input || moment.invalid();
		setCurrentDate(notNullInput);
		// Spread operator will not copy prototype
		// https://dmitripavlutin.com/object-rest-spread-properties-javascript/
		onChange(Object.assign(moment(), notNullInput, { name: name || '' }));
	};

	return (
		<FieldSet
			legend={label}
			id={`${id}-fieldset`}
			disabled={disabled}
			hint={hideHint ? undefined : 'For example: 04/28/1986'}
			status={status}
			optional={optional}
			className={cx('oec-date-input', 'oec-date-input-single', className)}
			showLegend={true}
		>
			<div className="grid-row flex-row flex-align-end grid-gap position-relative">
				<TextInput
					label={`${label} input`}
					id={id}
					onChange={e => setStringDate(e.target.value)}
					defaultValue={stringDate}
					// Key forces re-render on default value change without making text input a controlled component
					key={stringDate}
					onBlur={() => {
						const parsedInput = parseDateInput(stringDate);
						onChangeEvent(parsedInput);
					}}
					name={name}
					srOnlyLabel
					className="oec-date-input__text"
					// Make label sr only because it's in a fieldset
				/>
				<div className="oec-calendar-dropdown oec-date-input__calendar-dropdown">
					{/* TODO: CALENDAR ICON */}
					<Button
						text={<CalendarIcon className="oec-calendar-toggle__icon" />}
						onClick={() => setCalendarOpen(!calendarOpen)}
						aria-label={`${calendarOpen ? 'close' : 'open'} calendar`}
						className="oec-calendar-toggle oec-calendar-dropdown__toggle"
					/>
					<div
						className={`oec-calendar-dropdown__calendar position-absolute z-top ${
							calendarOpen ? '' : 'display-none'
						}`}
					>
						<DayPickerSingleDateController
							date={currentDate}
							onDateChange={newDate => {
								setStringDate(newDate ? newDate.format(momentFormat) : '');
								onChangeEvent(newDate);
							}}
							focused={calendarOpen || false}
							// Annoyingly this does not do anything for keyboard users
							onFocusChange={f => setCalendarOpen(f.focused || false)}
							onBlur={() => setCalendarOpen(false)}
							// TODO: IMPLEMENT ON TAB ONCE TYPES FOR THIS LIBRARY ARE UPDATED :/
							// onTab={() => {}}
							onOutsideClick={e => {
								const targetText = e.target.innerHTML;
								if (targetText !== 'C') {
									setCalendarOpen(false);
								}
							}}
							initialVisibleMonth={() => currentDate || moment()}
						/>
					</div>
				</div>
			</div>
		</FieldSet>
	);
};
