import React from 'react';
import InlineIcon from '../InlineIcon/InlineIcon';

export type FormErrorProps = {
	type: 'warning' | 'error';
	message?: string;
};

export default ({ message, type }: FormErrorProps) => {
	return (
		<span
			className={`usa-${type}-message`}
			id="field-set-error-message"
			role={type === 'error' ? 'alert' : 'status'}
		>
			{type === 'warning' ? <InlineIcon icon="incomplete" /> : ''} {message}
		</span>
	);
};
