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
	selected?: string;
	horizontal?: boolean;
};

export default function RadioGroup({
	options,
	groupName,
	onChange,
	selected,
	horizontal,
}: RadioGroupProps) {
	return (
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
	);
}
