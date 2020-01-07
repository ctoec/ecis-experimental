import React from 'react';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

type FieldSetProps = {
	legend: string | JSX.Element;
	id: string;
	showLegend?: boolean;
	status?: FormStatusProps;
	className?: string;
	hint?: string;
};

const FieldSet: React.FC<FieldSetProps> = ({
	legend,
	id,
	showLegend,
	status,
	className,
	children,
	hint,
}) => {
	if (typeof legend === 'string' && legend.length > 25) {
		// TODO: make this work regardless of element type
		console.warn('FieldSet legend is kind of long. This might be annoying for people using screen readers.')
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
    `}
			id={id}
			aria-describedby={ariaDescriber}
		>
			<legend
				className={
					showLegend ? `usa-label${status ? ` usa-label--${status.type}` : ''}` : 'usa-sr-only'
				}
				id={`fieldset-legend-${id}`}
			>
				{legend}
			</legend>
			{hint && <span className="usa-hint oec-form-helper">{hint}</span>}
			{status && <FormStatus {...status} />}
			<div className={`grid-gap grid-row ${className || ''}`}>{children}</div>
		</fieldset>
	);
};

export default FieldSet;
