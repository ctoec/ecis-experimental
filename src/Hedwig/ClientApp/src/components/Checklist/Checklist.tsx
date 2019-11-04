import React, { useState } from 'react';
import Checkbox from './Checkbox';

type CheckboxOptions = {
	text: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
};

type ChecklistProps = {
	options: CheckboxOptions[];
	groupName: string;
	onClick: (value: string) => any;
	legend: string;
	horizontal?: boolean;
	showError?: boolean;
	errorMessage?: string;
};

export default function Checklist({
	options,
	groupName,
	onClick,
	horizontal,
	legend,
	showError,
	errorMessage,
}: ChecklistProps) {

  const currentlySelectedValues: { [key: string]: any } = {};
  options.forEach(option => currentlySelectedValues[option.value] = option.checked);
  const [currentlySelected, setSelection] = useState(currentlySelectedValues);

	function toggleCheckboxSelection(value: string) {
    const nowSelected = Object.assign({}, currentlySelected, { value: !currentlySelectedValues[value] })
		setSelection(nowSelected);
  }

	return (
		<fieldset className={`usa-fieldset${showError ? ' usa-form-group--error' : ''}`}>
			<legend className="usa-sr-only">{legend}</legend>
			{showError && errorMessage && (
				<span className="usa-error-message" id="checklist-error-message" role="alert">
					{errorMessage}
				</span>
			)}
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
				{options.map(option => (
          <Checkbox
            value={option.value}
            text={option.text}
            onClick={event => {
              toggleCheckboxSelection(event.target.value);
              onClick(event.target.value);
            }}
            key={option.value}
            name={groupName}
            checked={currentlySelectedValues[option.value]}
            className={horizontal ? 'grid-col flex-auto' : ''}
            disabled={option.disabled}
          />
        )
        )}
			</div>
		</fieldset>
	);
}
