import React from 'react';
import { Tag } from '../Tag/Tag';

export type ProcessStepProps = {
	heading: string;
	body?: string;
	isNew?: boolean;
};

type InternalProcessStepProps = { key: string } & ProcessStepProps;

export function ProcessStep({ key, heading, body, isNew = false }: InternalProcessStepProps) {
	return (
		<li key={key} className="process-step">
			<div className="display-inline-block">{heading}</div> {isNew ? newTag() : undefined}
			<br />
			{body ? <span className="usa-hint text-italic"> {body}</span> : undefined}
		</li>
	);
}

function newTag() {
	return Tag({
		text: 'NEW',
		color: 'theme-color-primary',
	});
}
