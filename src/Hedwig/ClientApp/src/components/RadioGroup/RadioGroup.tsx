import React from 'react';
import RadioButton from './RadioButton';

type RadioButtonOptions = {
	text: string;
	value: string;
};

type RadioGroupProps = {
	options: RadioButtonOptions[];
	groupName: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	legend: string;
	selected?: string;
	horizontal?: boolean;
	error?: string;
};

export default function RadioGroup({
	options,
	groupName,
	onChange,
	selected,
	horizontal,
	legend,
	error,
}: RadioGroupProps) {
	return (
		<fieldset className={`usa-fieldset${error ? ' usa-form-group--error' : ''}`}>
			<legend className="usa-sr-only">{legend}</legend>
			{error && (
				<span className="usa-error-message" id="radio-group-error-message" role="alert">
					{error}
				</span>
			)}
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
				{options.map(option => (
					<RadioButton
						value={option.value}
						text={option.text}
						onChange={onChange}
						key={option.value}
						name={groupName}
						selected={option.value === selected}
						className={horizontal ? 'grid-col flex-auto' : ''}
					/>
				))}
			</div>
		</fieldset>
	);
}
