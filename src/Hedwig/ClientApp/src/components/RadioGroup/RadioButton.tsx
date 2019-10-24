import React from 'react';
import { ClassNames } from '@emotion/core';

type RadioButtonProps = {
	text: string;
	value: string;
	name: string;
	onClick: (value: any) => any;
	selected?: boolean;
	className?: string;
};

export default function RadioButton({
	text,
	value,
	name,
	onClick,
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
				defaultChecked={selected}
				onClick={value => onClick(value)}
			/>
			<label className="usa-radio__label" htmlFor={value}>
				{text}
			</label>
		</div>
	);
}
