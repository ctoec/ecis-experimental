import React from 'react';

type CheckboxProps = {
	id: string;
	text: string;
	value: string;
	name?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	selected?: boolean;
	className?: string;
	disabled?: boolean;
};

export default function Checkbox({
	id,
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
				id={id}
				type="checkbox"
				name={name || ''}
				value={value}
				defaultChecked={selected}
				onChange={onChange}
				disabled={disabled}
			/>
			<label className="usa-checkbox__label" htmlFor={id}>
				{text}
			</label>
		</div>
	);
}
