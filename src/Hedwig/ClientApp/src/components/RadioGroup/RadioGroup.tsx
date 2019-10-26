import React, { useState } from 'react';
import RadioButton from './RadioButton';

type RadioButtonOptions = {
	text: string;
	value: string;
};

type RadioGroupProps = {
	options: RadioButtonOptions[];
	groupName: string;
	onClick: (value: string) => any;
	legend: string;
	selected?: string;
	horizontal?: boolean;
	showError?: boolean;
	errorMessage?: string;
};

export default function RadioGroup({
	options,
	groupName,
	onClick,
	selected,
	horizontal,
	legend,
	showError,
	errorMessage,
}: RadioGroupProps) {
	const [currentlySelected, setSelection] = useState(selected);

	function setRadioButtonSelection(value: string | undefined) {
		setSelection(value);
	}

	return (
		<fieldset className={`usa-fieldset${showError ? ' usa-form-group--error' : ''}`}>
			<legend className="usa-sr-only">{legend}</legend>
			{showError && errorMessage && (
				<span className="usa-error-message" id="radio-group-error-message" role="alert">
					{errorMessage}
				</span>
			)}
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
				{options.map(option => (
					<RadioButton
						value={option.value}
						text={option.text}
						onClick={event => {
              setRadioButtonSelection(event.target.value);
              onClick(event.target.value);
            }}
						key={option.value}
						name={groupName}
						selected={selected === currentlySelected}
						className={horizontal ? 'grid-col flex-auto' : ''}
					/>
				))}
			</div>
		</fieldset>
	);
}
