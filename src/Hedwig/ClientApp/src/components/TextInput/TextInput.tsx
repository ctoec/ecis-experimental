import React from 'react';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

type TextInputProps = {
	label: string | JSX.Element;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
	id: string;
	defaultValue?: string;
	disabled?: boolean;
	status?: FormStatusProps;
	small?: boolean;
	optional?: boolean;
	className?: string;
	inputProps?: React.HTMLProps<HTMLInputElement>;
	inline?: boolean;
};

export default function TextInput({
	label,
	onChange,
	onBlur,
	id,
	defaultValue,
	disabled,
	status,
	small,
	optional,
	className,
	inputProps,
	inline,
}: TextInputProps) {
	return (
		<div className={`${className || ''} usa-form-group${status ? ` usa-form-group--${status.type}` : ''}`}>
			<label className={`usa-label${status ? ` usa-label--${status.type}` : ''}`} htmlFor={id}>
				{label} {optional && <span className="usa-label__optional">&nbsp;(optional)</span>}
			</label>
			{status && status.message && <FormStatus {...status} />}
			<input
				className={`usa-input${status ? ` usa-input--${status.type}` : ''}${
					small ? ' usa-input--small' : ''
				}${inline ? ' usa-input--inline' : ''}`}
				id={id}
				name={id}
				type="text"
				disabled={disabled}
				onChange={onChange}
				onBlur={onBlur}
				defaultValue={defaultValue}
				aria-describedby={status ? status.id : undefined}
				{...inputProps}
			/>
		</div>
	);
}
