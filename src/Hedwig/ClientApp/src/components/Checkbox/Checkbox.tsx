import React from 'react';

export type CheckboxProps = {
	id: string;
	text: string;
	name?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	defaultValue?: boolean;
	className?: string;
	disabled?: boolean;
};

export default function Checkbox({
	id,
	text,
	name,
	onChange,
	defaultValue,
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
				defaultChecked={defaultValue}
				onChange={onChange}
				disabled={!!disabled}
			/>
			<label className="usa-checkbox__label" htmlFor={id}>
				{text}
			</label>
		</div>
	);
}
