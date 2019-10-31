import React from 'react';

export type StepProps = {
	name: string;
};

export default function Step({ name }: StepProps) {
	return (
		<li className="oec-step-list__step">
			<div className="oec-step-list__step__content">
				<h2 className="oec-step-list__step__title">{name}</h2>
				<div className="oec-step-list__step__summary"></div>
				<div className="oec-step-list__step__form"></div>
			</div>
			<div className="oec-step-list__step__actions"></div>
		</li>
	);
}
