import React from 'react';
import { FormStatus, FormStatusProps } from '..';

export type FieldSetProps = {
	legend: string;
	id: string;
	showLegend?: boolean;
	status?: FormStatusProps;
	optional?: boolean;
	className?: string;
	hint?: string;
	childrenGroupClassName?: string;
	disabled?: boolean;
};

export const FieldSet: React.FC<FieldSetProps> = ({
	legend,
	id,
	showLegend,
	status,
	optional,
	className,
	children,
	hint,
	childrenGroupClassName,
	disabled,
}) => {
	if (typeof legend === 'string' && legend.length > 25) {
		// TODO: make this work regardless of element type
		console.warn(
			'FieldSet legend is kind of long. This might be annoying for people using screen readers.'
		);
	}
	const hintId = `${id}-hint`;
	let ariaDescriber;
	if (hint) {
		ariaDescriber = hintId;
	}
	if (status) {
		ariaDescriber = status.id;
	}
	return (
		<fieldset
			className={`grid-gap grid-row usa-fieldset
			${status ? ` usa-fieldset--${status.type}` : ''}
			 ${className}
			`}
			id={id}
			aria-describedby={ariaDescriber}
			// TODO: is this bad usability? are things that aren't optional always required?
			aria-required={!optional}
			aria-invalid={status && status.type === 'error'}
			disabled={disabled}
		>
			<legend id={`fieldset-legend-${id}`}>
				{/* Needs to be wrapped in another el because spacing works differently for legends */}
				<span
					className={
						showLegend ? `usa-label${status ? ` usa-label--${status.type}` : ''}` : 'usa-sr-only'
					}
				>
					{legend}
				</span>
			</legend>
			{hint && <span className="usa-hint text-italic">{hint}</span>}
			{status && <FormStatus {...status} />}
			<div className={`grid-gap grid-row ${childrenGroupClassName}`}>{children}</div>
		</fieldset>
	);
};
