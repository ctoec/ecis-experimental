import React from 'react';
import { default as Step, ExternalStepStatus, InternalStepProps, InternalStepStatus } from './Step';

// The statuses 'active' and 'notStarted' can only be assigned by StepList itself
export type StepStatus = ExternalStepStatus;

export type StepProps<T> = {
	key: string;
	name: string;
	status: (props: T) => StepStatus;
	editPath: string;
	Summary: React.FC<T>;
	Form: React.FC<T>;
};

type StepListProps<T> = {
	steps: StepProps<T>[];
	props: T;
	activeStep: string;
};

const mapStepsToInternalProps = function<T>(steps: StepProps<T>[], activeStep: string, props: T) {
	let activeStepReached = false;

	return steps.map(externalStep => {
		let status: InternalStepStatus;

		if (activeStepReached) {
			status = 'notStarted';
		} else if (externalStep.key === activeStep) {
			status = 'active';
			activeStepReached = true;
		} else {
			status = externalStep.status(props);
		}

		const step: InternalStepProps<T> = { ...externalStep, props, status };

		return step;
	});
};

export default function StepList<T>({ steps, props, activeStep }: StepListProps<T>) {
	const internalSteps = mapStepsToInternalProps(steps, activeStep, props);
	return (
		<ol className="oec-step-list">
			{internalSteps.map(step => (
				<Step {...step} />
			))}
		</ol>
	);
}
