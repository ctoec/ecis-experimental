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
  onClick: (value: any) => any;
  disabled?: boolean;
  horizontal?: boolean;
};

export default function RadioGroup({ options, groupName, onClick, horizontal }: RadioGroupProps) {
  return (
    <div role="group" aria-describedby="" className={`${horizontal ? 'grid-row' : ''}`}>
      {options.map(option =>
        <RadioButton
          value={option.value}
          text={option.text}
          onClick={value => onClick(value)}
          key={option.value}
          name={groupName}
          selected={option.selected}
        />)}
    </div>
  );
}
