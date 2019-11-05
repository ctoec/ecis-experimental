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
	error?: string;
};

export default function Checklist({
	options,
	groupName,
	onClick,
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
						onClick={event => {
							onClick(event.target.value);
						}}
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
