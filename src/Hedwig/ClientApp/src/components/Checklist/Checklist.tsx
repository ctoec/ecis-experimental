import React from 'react';
import Checkbox from './Checkbox';

type CheckboxOptions = {
	text: string;
	value: string;
	checked: boolean;
	disabled?: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
};

type ChecklistProps = {
	options: CheckboxOptions[];
	groupName: string;
	legend: string;
	horizontal?: boolean;
	error?: string;
};

export default function Checklist({
	options,
	groupName,
	horizontal,
	legend,
	error,
}: ChecklistProps) {
	return (
		<fieldset className={`usa-fieldset${error ? ' usa-form-group--error' : ''}`}>
			<legend className="usa-sr-only">{legend}</legend>
			{error && (
				<span className="usa-error-message" id="checklist-error-message" role="alert">
					{error}
				</span>
			)}
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
				{options.map(option => (
					<Checkbox
						value={option.value}
						text={option.text}
						onChange={option.onChange}
						key={option.value}
						name={groupName}
						checked={option.checked}
						className={horizontal ? 'grid-col flex-auto' : ''}
						disabled={option.disabled}
					/>
				))}
			</div>
		</fieldset>
	);
}
