import React, { useState, useEffect, useCallback } from 'react';
import moment, { Moment } from 'moment';
import cx from 'classnames';
import { DayPickerSingleDateController } from 'react-dates';
import { FieldSet, TextInput, FormStatusProps, Button } from '..';
import { ReactComponent as CalendarIcon } from '../../assets/images/calendar.svg';
import { parseStringDateInput } from '../../utils/stringFormatters';
import { InputField } from '../../utils/forms/form';
import { LegendStyleOptions } from '../FieldSet/FieldSet';

export type DateInputProps = {
	onChange_Old?: (newDate: InputField<Moment | null>) => any | void;
	onChange?: (ev: Event) => any;
	id: string;
	label: string;
	legendStyle?: LegendStyleOptions;
	defaultValue?: Date | null;
	disabled?: boolean;
	optional?: boolean;
	status?: FormStatusProps;
	className?: string;
	hideHint?: boolean;
	name?: string;
	forceBlur?: boolean;
};

const momentFormat = 'MM/DD/YYYY';

export const DateInput: React.FC<DateInputProps> = ({
	defaultValue = null,
	onChange_Old: inputOnChange_Old,
	onChange: inputOnChange,
	id,
	label: legend,
	legendStyle,
	disabled,
	optional,
	status: inputStatus,
	className,
	hideHint = false,
	name,
	forceBlur = false,
}) => {
	const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
	const [currentDate, setCurrentDate] = useState(defaultValue ? moment.utc(defaultValue) : null);
	const [stringDate, setStringDate] = useState<string | undefined>(
		currentDate ? currentDate.format(momentFormat) : undefined
	);
	const [dateIsInvalid, setDateIsInvalid] = useState(false);

	// Attach onChange event listener
	useEffect(() => {
		const target = document.getElementById(`${id}-internal`);
		if (!target || !inputOnChange) {
			return;
		}
		target.addEventListener('change', inputOnChange);
		return () => window.removeEventListener('change', inputOnChange);
	});

	const onMomentChange = useCallback(
		(input: Moment | null) => {
			// Whatever input is, set current date to that, even if it's not valid
			setCurrentDate(input);
			if (!input || !input.isValid()) {
				setDateIsInvalid(true);
			} else {
				// Only call the callback if it's a valid date
				// Spread operator will not copy prototype
				// https://dmitripavlutin.com/object-rest-spread-properties-javascript/
				inputOnChange_Old &&
					inputOnChange_Old(Object.assign(moment(), input, { name: name || '' }));
				// Update the hidden input to a string representation of
				// the date. Then trigger the event dispatch.
				const target = document.getElementById(`${id}-internal`);
				if (!target) {
					return;
				}
				const event = new Event('change');
				(target as HTMLInputElement).value = '' + input.valueOf();
				target.dispatchEvent(event);
				setDateIsInvalid(false);
			}
		},
		[setCurrentDate, setDateIsInvalid, id, inputOnChange_Old, name]
	);

	useEffect(() => {
		if (forceBlur) {
			onMomentChange(currentDate);
		}
	}, [forceBlur, onMomentChange, currentDate]);

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
			legend={legend}
			id={id}
			hint={hideHint ? undefined : `For example: ${moment().format('MM/DD/YYYY')}`}
			status={status}
			optional={optional}
			disabled={disabled}
			className={cx('oec-date-input', 'oec-date-input-single', className)}
			showLegend={true}
			legendStyle={legendStyle}
		>
			<input
				// Non-interactive input to play nice within a form component
				aria-hidden
				hidden
				disabled
				id={`${id}-internal`}
				defaultValue={currentDate && !dateIsInvalid ? '' + currentDate.valueOf() : undefined}
			/>
			<div className="flex-row flex-align-end grid-gap position-relative">
				<TextInput
					label={legend}
					srOnlyLabel
					// Make label sr only because it's in a fieldset
					id={`${id}-input`}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStringDate(e.target.value)}
					defaultValue={stringDate}
					// Key forces re-render on default value change without making text input a controlled component
					key={JSON.stringify(currentDate)}
					onBlur={() => {
						onStringDateChange(stringDate);
					}}
					name={name}
					className="oec-date-input__text"
					inputProps={{
						onKeyUp: (e: { key: string }) => {
							if (e.key === 'Enter') {
								onStringDateChange(stringDate);
							}
						},
					}}
					// Pass only status type and id so that text input will style itself apprpriately but not duplicate the message
					status={status ? { type: status.type, id: status.id } : undefined}
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
							onDateChange={(newDate) => {
								setStringDate(newDate ? newDate.format(momentFormat) : undefined);
								onMomentChange(newDate);
							}}
							focused={calendarOpen}
							// Annoyingly this does not do anything for keyboard users
							onFocusChange={(f) => setCalendarOpen(f.focused || false)}
							onBlur={() => setCalendarOpen(false)}
							// TODO: IMPLEMENT ON TAB ONCE TYPES FOR THIS LIBRARY ARE UPDATED :/
							// onTab={() => {}}
							onOutsideClick={(e) => {
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
