import React from 'react';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

type DropdownOption = {
	value: string;
	text: string;
};

type DropdownProps = {
	options: DropdownOption[];
	label: string;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
	id: string;
	selected?: string;
	noSelectionText?: string;
	disabled?: boolean;
	status?: FormStatusProps;
};

export default function Dropdown({
	options,
	selected,
	label,
	noSelectionText,
	onChange,
	id,
	disabled,
	status,
}: DropdownProps) {
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
			</select>
		</div>
	);
}
