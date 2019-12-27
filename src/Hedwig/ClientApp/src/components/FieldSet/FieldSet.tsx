import React from 'react';
import FormError, { FormErrorProps } from '../FormError/FormError';

type FieldSetProps = {
	legend: string | JSX.Element;
	id: string;
	showLegend?: boolean;
	error?: FormErrorProps;
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
	// TODO: throw warning if legend text is more than 20 chars?
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
			{error && <FormError {...error} />}
			{children}
		</fieldset>
	);
};

export default FieldSet;
