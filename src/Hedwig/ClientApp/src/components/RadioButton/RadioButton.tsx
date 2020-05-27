import React, { HTMLAttributes } from 'react';
import cx from 'classnames';

export type RadioButtonProps = {
	text: string;
	value: string;
	name: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	selected?: boolean;
	disabled?: boolean;
	className?: string;
} & Omit<HTMLAttributes<HTMLInputElement>, 'onChange'>;

/**
 * Component that wraps a native radio input element
 */
export default function RadioButton({
	text,
	value,
	name,
	onChange,
	selected,
	disabled,
	className,
	...props
}: RadioButtonProps) {
	return (
		<div className={cx('usa-radio', className)}>
			<input
				id={value}
				type="radio"
				className="usa-radio__input"
				name={name}
				value={value}
				checked={selected}
				disabled={!!disabled}
				onChange={onChange}
				{...props}
			/>
			<label className="usa-radio__label" htmlFor={value}>
				{text}
			</label>
		</div>
	);
}
