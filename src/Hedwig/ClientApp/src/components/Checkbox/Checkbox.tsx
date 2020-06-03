import React, { HTMLAttributes } from 'react';
import cx from 'classnames';

export type CheckboxProps = {
	id: string;
	text: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => any;
	defaultValue?: boolean;
	className?: string;
	disabled?: boolean;
	value?: string; //TODO remove when ChoiceList is gone
	name?: string; // TODO remove when ChoiceList is gone
} & Omit<HTMLAttributes<HTMLInputElement>, 'onChange' | 'defaultValue'>;

/**
 * Component that wraps a native checkbox input element
 */
export function Checkbox({
	id,
	text,
	onChange,
	defaultValue,
	className,
	disabled,
	...props
}: CheckboxProps) {
	return (
		<div className={cx('usa-checkbox', className)}>
			<input
				className="usa-checkbox__input"
				id={id}
				type="checkbox"
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
