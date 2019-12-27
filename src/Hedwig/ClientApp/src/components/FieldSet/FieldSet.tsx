import React from 'react';
import FormError, { FormErrorProps } from '../FormError/FormError';

type FieldSetProps = {
	legend: string;
	id: string;
	error?: FormErrorProps;
	display?: string;
};

const FieldSet: React.FC<FieldSetProps> = ({ legend, id, error, display, children }) => {
	return (
		<fieldset
			className={`grid-gap grid-row usa-fieldset 
      ${error ? ` usa-fieldset--${error.type}` : ''}
      ${display ? ` display-${display}` : ''}
    `}
			id={id}
		>
			<legend className="usa-sr-only" id={`fieldset-legend-${id}`}>
				{legend}
			</legend>
			{error && <FormError {...error} />}
			{children}
		</fieldset>
	);
};

export default FieldSet;
