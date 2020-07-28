import React from 'react';
import { InlineIcon } from '..';

export type FormStatusProps = {
	type: 'warning' | 'error' | 'success';
	id: string;
	// Unique id should be used with aria-describedby: https://www.deque.com/blog/anatomy-of-accessible-forms-error-messages/
	message?: string;
};

export const FormStatus = ({ message, type, id }: FormStatusProps) => {
	return (
		<span className={`usa-${type}-message`} id={id} role={type === 'error' ? 'alert' : 'status'}>
			{type === 'warning' && message ? <InlineIcon icon="incomplete" /> : ''} {message}
		</span>
	);
};
