import React from 'react';
import { FormError } from '../FieldSet/FieldSet';

type TextInputProps = {
  label: string | JSX.Element;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  id: string;
  defaultValue?: string;
  disabled?: boolean;
  success?: boolean;
  error?: FormError;
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
  errorMessage,
  errorType,
  small,
  optional,
}: TextInputProps) {
  return (
    <div className={`usa-form-group${error ? ` usa-form-group--${error.type}` : ''}`}>
      <label className={`usa-label${error ? ` usa-label--${error.type}` : ''}`} htmlFor={id}>
        {label} {optional && (<span className='usa-label__optional'>&nbsp;(optional)</span>)}
      </label>
      {error && (
        <span className={`usa-${error.type}-message`} id="input-error-message" role="alert">
          {error.message}
        </span>
      )}
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
        aria-describedby={error ? 'input-error-message' : undefined}
      />
    </div>
  );
}
