import React from 'react';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

type FieldSetProps = {
	legend: string | JSX.Element;
	id: string;
	showLegend?: boolean;
	status?: FormStatusProps;
	className?: string;
};

const FieldSet: React.FC<FieldSetProps> = ({
	legend,
	id,
	showLegend,
	status,
	className,
	children,
}) => {
	// if (typeof legend === 'string' && legend.length > 25) {
	// 	console.warn('FieldSet legend is kind of long. This might be annoying for people using screen readers.')
	// }
	return (
		<fieldset
			className={`grid-gap grid-row usa-fieldset 
			${status ? ` usa-fieldset--${status.type}` : ''}
    `}
			id={id}
			aria-describedby={status ? status.id : undefined}
		>
			<legend
				className={
					showLegend ? `usa-label${status ? ` usa-label--${status.type}` : ''}` : 'usa-sr-only'
				}
				id={`fieldset-legend-${id}`}
			>
				{legend}
			</legend>
			{status && <FormStatus {...status} />}
			<div className={`grid-gap grid-row ${className}`}>
				{children}
			</div>
		</fieldset>
	);
};

export default FieldSet;
