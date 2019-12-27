import React from 'react';
import InlineIcon from '../InlineIcon/InlineIcon';

export type FormStatusProps = {
	type: 'warning' | 'error' | 'success';
	message?: string;
	// TODO: add id so there can be aria-described by?
};

// TODO: how do we actually want to style success?
export default ({ message, type }: FormStatusProps) => {
	return (
		<span
			className={`usa-${type}-message`}
			// id=""
			role={type === 'error' ? 'alert' : 'status'}
		>
			{type === 'warning' ? <InlineIcon icon="incomplete" /> : ''} {message}
		</span>
	);
};
