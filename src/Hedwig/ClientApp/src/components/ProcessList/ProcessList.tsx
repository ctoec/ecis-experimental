import React from 'react';
import { ProcessStep, ProcessStepProps } from './ProcessStep';

export type ProcessListProps = {
	processStepProps: ProcessStepProps[];
	additionalClassName?: string;
};

export function ProcessList({ processStepProps, additionalClassName }: ProcessListProps) {
	return (
		<ol className={`process ${additionalClassName}`}>
			{processStepProps.map((props, idx) => (
				<ProcessStep {...props} key={`${idx}`} />
			))}
		</ol>
	);
}
