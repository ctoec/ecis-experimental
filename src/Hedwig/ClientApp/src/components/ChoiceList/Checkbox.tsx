import React from 'react';

type CheckboxProps = {
	text: string;
	value: string;
	name: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	selected?: boolean;
	className?: string;
	disabled?: boolean;
};

export function Checkbox({
	text,
	value,
	name,
	onChange,
	selected,
	className,
	disabled,
}: CheckboxProps) {
	return (
		<div className={`usa-checkbox ${className}`}>
			<input
				className="usa-checkbox__input"
				id={name}
				type="checkbox"
				name={name}
				value={value}
				defaultChecked={selected}
				onChange={onChange}
				disabled={disabled}
			/>
			<label className="usa-checkbox__label" htmlFor={name}>
				{text}
			</label>
		</div>
	);
}
