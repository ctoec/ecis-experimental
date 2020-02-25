import React from 'react';
import cx from 'classnames';

import { FormStatus, FormStatusProps } from '..';

type TextInputProps = {
	name?: string;
	label: string | JSX.Element;
	id: string;
	defaultValue?: string;
	disabled?: boolean;
	status?: FormStatusProps;
	small?: boolean;
	optional?: boolean;
	hideOptionalText?: boolean;
	// You might want to hide the text if it's in a fieldset that is optional, like in the date input component
	className?: string;
	inline?: boolean;
};

type TextInputHTMLInputElementProps = TextInputProps & {
	type: 'input';
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
	inputProps?: React.HTMLProps<HTMLInputElement> & { inputMode: 'text' } & { type: 'input' };
}

type TextInputHTMLTextAreaElementProps = TextInputProps & {
	type: 'textarea';
	onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => any;
	onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => any;
	inputProps?: React.HTMLProps<HTMLTextAreaElement> & { inputMode: 'text' } & { type: 'textarea' };
}

export function TextInput({
	type,
	name,
	label,
	onChange,
	onBlur,
	id,
	defaultValue,
	disabled,
	status,
	small,
	optional,
	hideOptionalText,
	className,
	inputProps,
	inline
}: TextInputHTMLInputElementProps | TextInputHTMLTextAreaElementProps) {
	let inputElement;
	switch (type) {
		case 'textarea':
			inputElement = (
				<textarea
					className={cx(
						'usa-textarea',
					)}
					id={id}
					name={name}
					disabled={disabled}
					onChange={onChange as (_: React.ChangeEvent<HTMLTextAreaElement>) => any}
					onBlur={onBlur as (_: React.FocusEvent<HTMLTextAreaElement>) => any}
					defaultValue={defaultValue}
					aria-describedby={status ? status.id : undefined}
					aria-invalid={status && status.type === 'error'}
					// Using aria-required to avoid default Chrome behavior
					aria-required={!optional}
					{...inputProps as React.HTMLProps<HTMLTextAreaElement>}
				/>
			);
			break;
		case 'input':
		default:
			inputElement = (
				<input
					className={cx(
						'usa-input',
						{
							[`usa-input--${status && status.type}`]: status
						},
						{
							'usa-input--small': small
						},
						{
							'usa-input--inline': inline
						}
					)}
					id={id}
					name={name}
					type="text"
					disabled={disabled}
					onChange={onChange as (_: React.ChangeEvent<HTMLInputElement>) => any}
					onBlur={onBlur as (_: React.FocusEvent<HTMLInputElement>) => any}
					defaultValue={defaultValue}
					aria-describedby={status ? status.id : undefined}
					aria-invalid={status && status.type === 'error'}
					// Using aria-required to avoid default Chrome behavior
					aria-required={!optional}
					{...inputProps as React.HTMLProps<HTMLInputElement>}
				/>
			);
	}

	return (
		<div
			className={`${className || ''} usa-form-group${
				status ? ` usa-form-group--${status.type}` : ''
			}`}
		>
			<label className={`usa-label${status ? ` usa-label--${status.type}` : ''}`} htmlFor={id}>
				{label}{' '}
				{optional && !hideOptionalText && <span className="usa-hint">&nbsp;(optional)</span>}
			</label>
			{status && status.message && <FormStatus {...status} />}
			{inputElement}
		</div>
	);
}
