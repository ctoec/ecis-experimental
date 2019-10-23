import React from 'react';
import RadioButton from './RadioButton';

interface RadioButton {
  selected: boolean | undefined;
  text: string,
  value: string,
};

type RadioGroupProps = {
  options: RadioButton[];
  groupName: string,
  onClick: (value: string) => any;
  horizontal?: boolean;
  legend?: string;
};

export default function RadioGroup({ options, groupName, onClick, horizontal, legend }: RadioGroupProps) {
  return (
    <fieldset className="usa-fieldset">
      {legend && <legend className="usa-sr-only">{legend}</legend>}
      <div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
        {options.map(option =>
          <RadioButton
            value={option.value}
            text={option.text}
            onClick={event => onClick(event.target.value)}
            key={option.value}
            name={groupName}
            selected={option.selected}
            className={horizontal ? 'grid-col flex-auto': ''}
          />
        )}
      </div>
    </fieldset>
  );
}
