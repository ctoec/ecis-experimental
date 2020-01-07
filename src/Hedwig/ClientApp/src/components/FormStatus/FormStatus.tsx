import React from 'react';
import InlineIcon from '../InlineIcon/InlineIcon';

export type FormStatusProps = {
	type: 'warning' | 'error' | 'success';
	id: string;
	// Unique id should be used with aria-describedby: https://www.deque.com/blog/anatomy-of-accessible-forms-error-messages/
	message?: string;
};

export default ({ message, type, id }: FormStatusProps) => {
	return (
		<span
			className={`usa-${type}-message`}
			id={id}
			role={type === 'error' ? 'alert' : 'status'}
		>
			{(type === 'warning' && message) ? <InlineIcon icon="incomplete" /> : ''} {message}
		</span>
	);
};
