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
}: TextInputProps) {
  return (
		<div className={`usa-form-group${status ? ` usa-form-group--${status.type}` : ''}`}>
			<label className={`usa-label${status ? ` usa-label--${status.type}` : ''}`} htmlFor={id}>
				{label} {optional && '(Optional)'}
			</label>
			{status && status.message && <FormStatus {...status} />}
			<input
				className={`usa-input${status ? ` usa-input--${status.type}` : ''}${
					small ? ' usa-input--small' : ''
				}`}
				id={id}
				name={id}
				type="text"
				disabled={disabled}
				onChange={onChange}
				onBlur={onBlur}
				defaultValue={defaultValue}
				aria-describedby={status ? status.id : undefined}
			/>
		</div>
	);
}