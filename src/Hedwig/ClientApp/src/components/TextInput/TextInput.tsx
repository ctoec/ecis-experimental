import React from 'react';
import InlineIcon from '../InlineIcon/InlineIcon';

type TextInputProps = {
  label: string | JSX.Element;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  id: string;
  defaultValue?: string;
  disabled?: boolean;
  success?: boolean;
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
  errorMessage,
  errorType,
  small,
  optional,
}: TextInputProps) {
  return (
    <div className={`usa-form-group${errorType === 'error' ? ` usa-form-group--error` : ''}`}>
      <label className={`usa-label${errorType ? ` usa-label--${errorType}` : ''}`} htmlFor={id}>
        {label} {optional && '(Optional)'}
      </label>
      {errorType && (
        <span className={`usa-error-message`} id="input-error-message" role="alert">
          {errorMessage} 
        </span>
      )}
      <input
        className={`usa-input${errorType ? ` usa-input--${errorType}` : ''}${
          small ? ' usa-input--small' : ''
          }${success ? ' usa-input--success' : ''}`}
        id={id}
        name={id}
        type="text"
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        defaultValue={defaultValue}
        aria-describedby={errorMessage ? 'input-error-message' : undefined}
      />
    </div>
  );
}