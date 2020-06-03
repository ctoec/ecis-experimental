import React, { HTMLAttributes } from 'react';

export type CheckboxProps = {
	id: string;
	text: string;
	value: string;
	name?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
	defaultValue?: boolean;
	className?: string;
	disabled?: boolean;
} & Omit<HTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue'>;

/**
 * Component that wraps a native checkbox input element
 */
export function Checkbox({
	id,
	text,
	name,
	value,
	onChange,
	defaultValue,
	className,
	disabled,
	...props
}: CheckboxProps) {
	return (
		<div className={`usa-checkbox ${className}`}>
			<input
				className="usa-checkbox__input"
				id={id}
				type="checkbox"
				name={name || ''}
				value={value}
				defaultChecked={defaultValue}
				onChange={onChange}
				disabled={!!disabled}
				{...props}
			/>
			<label className="usa-checkbox__label" htmlFor={id}>
				{text}
			</label>
		</div>
	);
}

export default Checkbox;
