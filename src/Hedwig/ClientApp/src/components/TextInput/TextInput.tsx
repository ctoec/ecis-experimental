import React from 'react';

type TextInputProps = {
  label: string | JSX.Element;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => any;
  id: string;
  defaultValue?: string;
  disabled?: boolean;
  success?: boolean;
  error?: string;
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
    <div className={`usa-form-group${error ? ' usa-form-group--error' : ''}`}>
      <label className={`usa-label${error ? ' usa-label--error' : ''}`} htmlFor={id}>
        {label} {optional && '(Optional)'}
      </label>
      {error && (
        <span className="usa-error-message" id="input-error-message" role="alert">
          {error}
        </span>
      )}
      <input
        className={`usa-input${error ? ' usa-input--error' : ''}${
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