import React from 'react';
import { Tag } from '@ctoec/component-library';

export type ProcessStepProps = {
	heading: string;
	body?: string;
	isNew?: boolean;
};

export const ProcessStep: React.FC<ProcessStepProps> = ({ heading, body, isNew = false }) => {
	return (
		<li className="process-step">
			<div className="display-inline-block">{heading}</div>
			{isNew ? <Tag text="NEW" color="theme-color-primary margin-left-1" /> : undefined}
			<br />
			{body ? <span className="usa-hint text-italic"> {body}</span> : undefined}
		</li>
	);
};
