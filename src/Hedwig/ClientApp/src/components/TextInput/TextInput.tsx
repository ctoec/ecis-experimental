import React, { useState } from 'react';

type TextInputProps = {
	label: string;
	onChange: () => any;
	id?: string;
	defaultValue?: string;
	disabled?: boolean;
	success?: boolean;
	error?: boolean;
	errorMessage?: string;
};

export default function TextInput({
	label,
	onChange,
	id,
	defaultValue,
	disabled,
	success,
	error,
	errorMessage,
}: TextInputProps) {
	const [focused, setFocus] = useState(false);
	const inputId = id || label.split(' ').join('-');

	return (
		<div className={`usa-form-group${error ? ' usa-form-group--error' : ''}`}>
			<label className={`usa-label${error ? ' usa-label--error' : ''}`} htmlFor={inputId}>
				{label}
			</label>
			{error && errorMessage && (
				<span className="usa-error-message" id="input-error-message" role="alert">
					{errorMessage}
				</span>
			)}
			<input
				className={`usa-input${focused ? ' usa-focus' : ''}${error ? ' usa-input--error' : ''}${
					success ? ' usa-input--success' : ''
				}`}
				id={inputId}
				name={inputId}
				type="text"
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
        disabled={disabled}
        onChange={onChange}
				defaultValue={defaultValue}
        aria-describedby={error ? 'input-error-message' : undefined}
			/>
		</div>
	);
}
