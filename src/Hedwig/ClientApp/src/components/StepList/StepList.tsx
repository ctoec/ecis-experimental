import React from 'react';
import {
	default as Step,
	ExternalStepStatus,
	InternalStepProps,
	InternalStepStatus,
	PossibleHeaderLevels,
} from './Step';
import cx from 'classnames';

// The statuses 'active' and 'notStarted' can only be assigned by StepList itself
export type StepStatus = ExternalStepStatus;

export type StepProps<T> = {
	key: string;
	name: string;
	status: (props: T) => StepStatus;
	editPath?: string;
	Summary: React.FC<T>;
	Form: React.FC<T>;
	headerLevel?: PossibleHeaderLevels;
};

export type StepListProps<T> = {
	steps: StepProps<T>[];
	props: T;
	activeStep: string;
	type?: 'normal' | 'embedded';
	// https://dev.to/s_aitchison/psa-stop-hard-coding-heading-levels-in-your-react-components-2ekp
	headerLevel?: PossibleHeaderLevels;
};

const mapStepsToInternalProps = function <T>(steps: StepProps<T>[], activeStep: string, props: T) {
	let activeStepReached = false;

	return steps.map((externalStep) => {
		let status: InternalStepStatus;

		if (activeStepReached) {
			status = 'notStarted';
		} else if (externalStep.key === activeStep) {
			status = 'active';
			activeStepReached = true;
		} else {
			status = externalStep.status(props);
		}
		const step: InternalStepProps<T> = { headerLevel: 'h2', ...externalStep, props, status };

		return step;
	});
};

export function StepList<T>({
	steps,
	props,
	activeStep,
	type = 'normal',
	headerLevel = 'h2',
}: StepListProps<T>) {
	const internalSteps = mapStepsToInternalProps(steps, activeStep, props);
	return (
		<ol className={cx('oec-step-list', { embedded: type === 'embedded' })}>
			{internalSteps.map((step) => (
				<Step {...step} type={type} headerLevel={headerLevel} />
			))}
		</ol>
	);
}

export default StepList;
