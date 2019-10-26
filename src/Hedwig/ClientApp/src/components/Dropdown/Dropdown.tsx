import React from 'react';

type DropdownOption = {
	value: string;
	text: string;
};

type DropdownProps = {
	options: DropdownOption[];
	label: string;
	unselectedOptionText: string;
	onChange: () => any;
	id?: string;
	success?: boolean;
	disabled?: boolean;
	error?: boolean;
	errorMessage?: string;
};

export default function Dropdown({
	options,
	label,
	unselectedOptionText,
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
			>
				<option value={undefined}>{unselectedOptionText}</option>
				{options.map(option => (
					<option value={option.value}>{option.text}</option>
				))}
			</select>
		</div>
	);
}
