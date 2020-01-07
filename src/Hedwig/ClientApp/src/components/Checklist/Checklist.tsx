import React from 'react';
import Checkbox from './Checkbox';
import FieldSet from '../FieldSet/FieldSet';
import { FormStatusProps } from '../FormStatus/FormStatus';

type CheckboxOptions = {
	text: string;
	value: string;
	checked: boolean;
	disabled?: boolean;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
};

type ChecklistProps = {
	options: CheckboxOptions[];
	id: string;
	legend: string;
	horizontal?: boolean;
	status?: FormStatusProps;
	className?: string;
};

export default function Checklist({
	options,
	id,
	horizontal,
	legend,
	status,
	className
}: ChecklistProps) {
	return (
		<FieldSet
			legend={legend}
			status={status}
			id={id}
			className={className}
		>
			<div className={horizontal ? 'grid-row flex-align-start grid-gap' : ''}>
				{options.map(option => (
					<Checkbox
						value={option.value}
						text={option.text}
						onChange={option.onChange}
						key={option.value}
						name={`${id}-${option.value}`}
						checked={option.checked}
						className={horizontal ? 'grid-col flex-auto' : ''}
						disabled={option.disabled}
					/>
				))}
			</div>
		</FieldSet>
	);
}
