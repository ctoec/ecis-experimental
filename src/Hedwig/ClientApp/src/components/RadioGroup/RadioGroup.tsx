import React from 'react';
import RadioButton from './RadioButton';
import FieldSet from '../FieldSet/FieldSet';
import { FormStatusProps } from '../FormStatus/FormStatus';

type RadioButtonOptions = {
	text: string;
	value: string;
};

type RadioGroupProps = {
	options: RadioButtonOptions[];
	groupName: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	selected?: string;
	horizontal?: boolean;
	legend: string;
	status?: FormStatusProps;
};

export default function RadioGroup({
	options,
	groupName,
	onChange,
	selected,
	horizontal,
	legend,
	status
}: RadioGroupProps) {
	return (
		<FieldSet
			legend={legend}
			status={status}
			id={groupName}
			aria-describedby={status ? status.id : undefined}
		>
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
		</FieldSet>

	);
}
