import React from 'react';

export type AlertType = 'success' | 'warning' | 'error' | 'info';
export type AlertProps = {
	type: AlertType;
	text: string | JSX.Element;
	heading?: string;
	actionItem?: JSX.Element;
};

export function Alert({ type, heading, text, actionItem }: AlertProps) {
	// If in the future we make this interactive, we should use the alertdialog role
	return (
		<div
			className={`usa-alert usa-alert--${type} grid-row margin-y-4`}
			role={type === 'error' ? 'alert' : undefined}
		>
			<div className="display-flex flex-fill">
				<div className="usa-alert__body grid-col flex-fill">
					{heading && <h2 className="usa-alert__heading">{heading}</h2>}
					<p className="usa-alert__text">{text}</p>
				</div>
				<div className="usa-alert__body flex-auto display-flex flex-align-center">{actionItem}</div>
			</div>
		</div>
	);
}
