import React from 'react';

type AlertProps = {
	type: 'success' | 'warning' | 'error' | 'info';
	heading: string;
	text: string;
};

export default function Alert({ type, heading, text }: AlertProps) {
	// If in the future we make this interactive, we should use the alertdialog role
	return (
		<div className={`usa-alert usa-alert--${type}`} role={type === 'error' ? 'alert' : undefined}>
			<div className="usa-alert__body">
				<h3 className="usa-alert__heading">{heading}</h3>
				<p className="usa-alert__text">{text}</p>
			</div>
		</div>
	);
}
