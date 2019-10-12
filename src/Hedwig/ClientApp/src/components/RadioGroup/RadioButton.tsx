import React from 'react';

type RadioButtonAppearance = 'default' | 'base' | 'secondary';

type RadioButtonProps = {
  text: string;
  value: string;
  name: string,
  onClick: (value: any) => any;
  selected?: boolean,
  appearance?: RadioButtonAppearance;
  disabled?: boolean;
};

export default function RadioButton({ text, value, name, onClick, selected, appearance, disabled }: RadioButtonProps) {
  return (
    <div className={`margin-right-2 usa-radio ${
      appearance && appearance !== 'default' ? 'usa-button--' + appearance : ''
        }`}>
      <input
        className="usa-radio__input"
        id={value}
        type="radio"
        name={name}
        value={value}
        disabled={disabled}
        defaultChecked={selected}
        onClick={value => onClick(value)}
      />
      <label className="usa-radio__label" htmlFor={value}>{text}</label>
    </div>
  );
}
