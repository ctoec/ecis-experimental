import React from 'react';
import { default as Step, StepProps } from './Step';

type StepListProps = {
	steps: StepProps[];
};

export default function StepList({ steps }: StepListProps) {
	return (
		<ol className="oec-step-list">
			{steps.map(step => (
				<Step {...step} />
			))}
		</ol>
	);
}
