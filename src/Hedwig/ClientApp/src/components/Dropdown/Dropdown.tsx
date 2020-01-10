import React, { useState } from 'react';
import { TextInput, FormStatus, FormStatusProps } from '..';

type DropdownOption = {
	value: string;
	text: string;
};

type DropdownProps = {
	options: DropdownOption[];
	label: string;
	id: string;
	selected?: string;
	noSelectionText?: string;
	onChange: (event: React.ChangeEvent<HTMLSelectElement|HTMLInputElement>) => any;
	otherText?: string;
	disabled?: boolean;
	status?: FormStatusProps;
};

export function Dropdown({
	options,
	selected,
	label,
	noSelectionText,
	onChange,
	otherText,
	id,
	disabled,
	status,
}: DropdownProps) {
	const [showOtherTextInput, updateShowOtherTextInput] = useState(false);

	/**
	 * When 'otherText' is defined, it means the dropdown should display a text input
	 * field when user selects other text value from dropdown. This wraps the user-
	 * defined onChange function to handle display logic for the otherText input
	 */
	const userDefinedOnChange = onChange;
	if(otherText != undefined) {
		onChange = event => {
			if(event.target.value === otherText) {
				updateShowOtherTextInput(true);
			} else {
				updateShowOtherTextInput(false);
			}
			userDefinedOnChange(event);
		}
	}

	return (
		<div className={`usa-form-group${status ? ` usa-form-group--${status.type}` : ''}`}>
			<label className={`usa-label${status ? ` usa-label--${status.type}` : ''}`} htmlFor={id}>
				{label}
			</label>
			{status && status.message && <FormStatus {...status} />}
			<select
				className={`usa-select${status ? ` usa-input--${status.type}` : ''}`}
				name={id}
				id={id}
				onChange={onChange}
				disabled={disabled}
				aria-describedby={status ? status.id : undefined}
				value={selected}
			>
				{noSelectionText && <option value={undefined}>{noSelectionText}</option>}
				{options.map(option => (
					<option value={option.value} key={`${option.value}`}>
						{option.text}
					</option>
				))}
				{otherText != undefined && <option value={otherText}>{otherText}</option>}
			</select>
			{showOtherTextInput && otherText != undefined &&
				<TextInput
					id="other"
					label=""
					defaultValue=""
					onChange={userDefinedOnChange}
				/>
			}
		</div>
	);
}
