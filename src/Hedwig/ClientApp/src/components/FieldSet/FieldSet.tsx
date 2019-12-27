import React from 'react';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

type FieldSetProps = {
	legend: string;
	id: string;
	showLegend?: boolean;
	status?: FormStatusProps;
	display?: string;
};

const FieldSet: React.FC<FieldSetProps> = ({
	legend,
	id,
	showLegend,
	status,
	display,
	children,
}) => {
	if (legend.length > 25) {
		console.warn('FieldSet legend is kind of long. This might be annoying for people using screen readers.')
	}
	return (
		<fieldset
			className={`grid-gap grid-row usa-fieldset 
			${status ? ` usa-fieldset--${status.type}` : ''}
      ${display ? ` display-${display}` : ''}
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
			{children}
		</fieldset>
	);
};

export default FieldSet;
