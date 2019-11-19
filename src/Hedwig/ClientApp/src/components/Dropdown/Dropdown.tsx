import React from 'react';

type DropdownOption = {
	value: string;
	text: string;
};

type DropdownProps = {
	options: DropdownOption[];
	selected?: string;
	label: string;
	noSelectionText?: string;
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
	id?: string;
	success?: boolean;
	disabled?: boolean;
	error?: boolean;
	errorMessage?: string;
};

export default function Dropdown({
	options,
	selected,
	label,
	noSelectionText,
	onChange,
	id,
	success,
	disabled,
	error,
	errorMessage,
}: DropdownProps) {
	const selectId = id || label.split(' ').join('-');
	const errorMessageId = `${selectId}-error-message`;

	return (
		<div className={`usa-form-group${error ? ' usa-form-group--error' : ''}`}>
			<label className={`usa-label${error ? ' usa-label--error' : ''}`} htmlFor={selectId}>
				{label}
			</label>
			{error && errorMessage && (
				<span className="usa-error-message" id={errorMessageId} role="alert">
					{errorMessage}
				</span>
			)}
			<select
				className={`usa-select${error ? ' usa-input--error' : ''}${
					success ? ' usa-input--success' : ''
				}`}
				name={selectId}
				id={selectId}
				onChange={onChange}
				disabled={disabled}
				aria-describedby={error ? errorMessageId : undefined}
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
