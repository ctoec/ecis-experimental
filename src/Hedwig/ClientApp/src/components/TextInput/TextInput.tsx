import React from 'react';
import FormError, { FormErrorProps } from '../FormError/FormError';

type TextInputProps = {
  label: string | JSX.Element;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  id: string;
  defaultValue?: string;
  disabled?: boolean;
  success?: boolean;
  error?: FormErrorProps;
  errorMessage?: string;
  errorType?: 'error' | 'warning';
  small?: boolean;
  optional?: boolean;
};

export default function TextInput({
  label,
  onChange,
  onBlur,
  id,
  defaultValue,
  disabled,
  success,
  error,
  small,
  optional,
}: TextInputProps) {
  return (
		<div className={`usa-form-group${error ? ` usa-form-group--${error.type}` : ''}`}>
			<label className={`usa-label${error ? ` usa-label--${error.type}` : ''}`} htmlFor={id}>
				{label} {optional && '(Optional)'}
			</label>
			{error && <FormError {...error} />}
			<input
				className={`usa-input${error ? ` usa-input--${error.type}` : ''}${
					small ? ' usa-input--small' : ''
				}${success ? ' usa-input--success' : ''}`}
				id={id}
				name={id}
				type="text"
				disabled={disabled}
				onChange={onChange}
				onBlur={onBlur}
				defaultValue={defaultValue}
				aria-describedby={error ? `${id}-input-error-message` : undefined}
			/>
		</div>
	);
}