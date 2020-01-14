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
		>
			<legend
				className={
					showLegend ? `usa-label${status ? ` usa-label--${status.type}` : ''}` : 'usa-sr-only'
				}
				id={`fieldset-legend-${id}`}
			>
				{legend}
			</legend>
			{hint && <span className="usa-hint">{hint}</span>}
			{status && <FormStatus {...status} />}
			<div className={`grid-gap grid-row ${childrenGroupClassName}`}>{children}</div>
		</fieldset>
	);
};
