import React from 'react';
import Checkbox from './Checkbox';
import FieldSet from '../FieldSet/FieldSet';
import { FormErrorProps } from '../FormError/FormError';

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
	horizontal?: boolean;
	legend: string;
	error?: FormErrorProps;
};

export default function Checklist({
	options,
	groupName,
	horizontal,
	legend,
	error
}: ChecklistProps) {
	return (
		<FieldSet
			legend={legend}
			error={error}
			id={groupName}
		>
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
		</FieldSet>
	);
}
