import React from 'react';

type RadioButtonProps = {
	text: string;
	value: string;
	name: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	selected?: boolean;
	className?: string;
};

export default function RadioButton({
	text,
	value,
	name,
	onChange,
	selected,
	className,
}: RadioButtonProps) {
	return (
		<div className={`usa-radio ${className}`}>
			<input
				className="usa-radio__input"
				id={value}
				type="radio"
				name={name}
				value={value}
				checked={selected}
				onChange={onChange}
			/>
			<label className="usa-radio__label" htmlFor={value}>
				{text}
			</label>
		</div>
	);
}