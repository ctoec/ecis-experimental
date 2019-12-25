import React from 'react';
import InlineIcon from '../InlineIcon/InlineIcon';
import { ValidationErrorFromJSONTyped } from '../../generated';

export type FormError = {
	message?: string;
	type: 'warning' | 'error';
};

type FieldSetProps = {
	legend: string;
	id: string;
	error?: FormError;
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
			{error && (
				<span
					className={`usa-${error.type}-message`}
					id="field-set-error-message"
					role={error.type === 'error' ? 'alert' : 'status'}
				>
					{error.type === 'warning' ? <InlineIcon icon="incomplete" /> : ''} {error.message}
				</span>
			)}
			{children}
		</fieldset>
	);
};
export default FieldSet;
