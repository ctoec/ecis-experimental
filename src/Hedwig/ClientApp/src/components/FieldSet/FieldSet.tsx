import React from 'react';
import FormStatus, { FormStatusProps } from '../FormStatus/FormStatus';

type FieldSetProps = {
	legend: string;
	id: string;
	showLegend?: boolean;
	error?: FormStatusProps;
	success?: boolean;
	display?: string;
};

const FieldSet: React.FC<FieldSetProps> = ({
	legend,
	id,
	showLegend,
	error,
	display,
	children,
}) => {
	if (legend.length > 25) {
		console.warn('FieldSet legend is kind of long. This might be annoying for people using screen readers.')
	}
	return (
		<fieldset
			className={`grid-gap grid-row usa-fieldset 
			${error ? ` usa-fieldset--${error.type}` : ''}
      ${display ? ` display-${display}` : ''}
    `}
			id={id}
		>
			<legend
				className={
					showLegend ? `usa-label${error ? ` usa-label--${error.type}` : ''}` : 'usa-sr-only'
				}
				id={`fieldset-legend-${id}`}
			>
				{legend}
			</legend>
			{error && <FormStatus {...error} />}
			{children}
		</fieldset>
	);
};

export default FieldSet;
