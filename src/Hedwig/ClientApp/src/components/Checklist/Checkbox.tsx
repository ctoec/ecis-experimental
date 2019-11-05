import React from 'react';

type CheckboxProps = {
	text: string;
	value: string;
	name: string;
	onClick: (value: any) => any;
	checked?: boolean;
	className?: string;
	disabled?: boolean;
};

export default function Checkbox({
	text,
	value,
	name,
	onClick,
	checked,
	className,
	disabled,
}: CheckboxProps) {
	return (
		<div className={`usa-checkbox ${className}`}>
			<input
				className="usa-checkbox__input"
				id={value}
				type="checkbox"
				name={name}
				value={value}
				defaultChecked={checked}
				onClick={value => onClick(value)}
				disabled={disabled}
			/>
			<label className="usa-checkbox__label" htmlFor={value}>
				{text}
			</label>
		</div>
	);
}
