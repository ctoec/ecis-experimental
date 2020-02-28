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
const parseStringDateInput = (input?: string): Moment | null => {
	let parsedInput = null;
	if (input) {
		const acceptedDelimiters = ['-', '/', ' '];
		acceptedDelimiters.forEach(d => {
			const splitInput = input.split(d);
			if (splitInput.length === 3) {
				// Will never be empty but ts doesn't know that
				splitInput.unshift(splitInput.pop() || '');
				// For parsing consistency across browsers
				parsedInput = moment(splitInput.join('-'), 'YYYY-MM-DD');
			}
		});
	}
	return parsedInput;
};

const momentFormat = 'MM/DD/YYYY';

export const DateInput: React.FC<DateInputProps> = ({
	date = null,
	onChange: inputOnChange,
	id,
	label,
	disabled,
	optional,
	status: inputStatus,
	className,
	hideHint = false,
	name,
}) => {
	const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
	const [currentDate, setCurrentDate] = useState(date);
	const [stringDate, setStringDate] = useState<string | undefined>(
		currentDate ? currentDate.format(momentFormat) : undefined
	);
	const [dateIsInvalid, setDateIsInvalid] = useState();

	const onMomentChange = (input: Moment | null) => {
		// Whatever input is, set current date to that, even if it's not valid
		setCurrentDate(input);
		if (!input || !input.isValid()) {
			setDateIsInvalid(true);
		} else {
			// Only call the callabck if it's a valid date
			// Spread operator will not copy prototype
			// https://dmitripavlutin.com/object-rest-spread-properties-javascript/
			inputOnChange(Object.assign(moment(), input, { name: name || '' }));
			setDateIsInvalid(false);
		}
	};

	const onStringDateChange = (input: string | undefined) => {
		if (!input && !currentDate) {
			// If the new date didn't exist and there wasn't already a date, don't set a warning
			return;
		}
		// Called on blur or on enter-- not on string change because that would show a warning after one key stroke
		const newDate = parseStringDateInput(input);
		// Otherwise if it's valid, proceed
		onMomentChange(newDate);
	};

	let status = inputStatus;
	if (dateIsInvalid) {
		status = { type: 'warning', id: `${id}-error`, message: 'Invalid date' };
	}

	return (
		<FieldSet
			legend={label}
			id={id}
			hint={hideHint ? undefined : 'For example: 04/28/1986'}
			status={status}
			optional={optional}
			disabled={disabled}
			className={cx('oec-date-input', 'oec-date-input-single', className)}
			showLegend={true}
		>
			<div className="grid-row flex-row flex-align-end grid-gap position-relative">
				<TextInput
					label={label}
					srOnlyLabel
					id={`${id}-input`}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStringDate(e.target.value)}
					defaultValue={stringDate}
					// Key forces re-render on default value change without making text input a controlled component
					key={JSON.stringify(currentDate)}
					onBlur={() => {
						onStringDateChange(stringDate);
					}}
					name={name}
					// Make label sr only because it's in a fieldset
					className="oec-date-input__text"
					inputProps={{
						onKeyUp: (e: { key: string }) => {
							if (e.key === 'Enter') {
								onStringDateChange(stringDate);
							}
						},
					}}
				/>
				<div className="oec-calendar-dropdown oec-date-input__calendar-dropdown">
					<Button
						text={<CalendarIcon className="oec-calendar-toggle__icon" />}
						onClick={() => {
							setCalendarOpen(!calendarOpen);
						}}
						title={`${calendarOpen ? 'close' : 'open'} calendar`}
						className="oec-calendar-toggle oec-calendar-dropdown__toggle"
					/>
					<div
						className="oec-calendar-dropdown__calendar position-absolute z-top"
						hidden={!calendarOpen}
					>
						<DayPickerSingleDateController
							// Key forces re-render, which helps deal with bugs in this library-- see scss file
							key={JSON.stringify({ stringDate, dateIsInvalid, currentDate, calendarOpen })}
							date={currentDate}
							onDateChange={newDate => {
								setStringDate(newDate ? newDate.format(momentFormat) : undefined);
								onMomentChange(newDate);
							}}
							focused={calendarOpen}
							// Annoyingly this does not do anything for keyboard users
							onFocusChange={f => setCalendarOpen(f.focused || false)}
							onBlur={() => setCalendarOpen(false)}
							// TODO: IMPLEMENT ON TAB ONCE TYPES FOR THIS LIBRARY ARE UPDATED :/
							// onTab={() => {}}
							onOutsideClick={e => {
								const clickOnCalendarOrButton = e.target.closest(`#${id} .oec-calendar-dropdown`);
								// If a user clicks the button again, the button will handle closing it, and this would fire first and cause problems
								if (!clickOnCalendarOrButton) {
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
