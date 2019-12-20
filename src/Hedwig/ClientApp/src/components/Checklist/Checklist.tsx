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
	horizontal?: boolean;
};

export default function Checklist({
	options,
	groupName,
	horizontal,
}: ChecklistProps) {
	return (
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
	);
}
