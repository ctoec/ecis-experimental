import React from 'react';
import { Link } from 'react-router-dom';
import { InlineIcon } from '..';

export type ExternalStepStatus = 'incomplete' | 'complete' | 'attentionNeeded' | 'exempt';

export type InternalStepStatus = 'notStarted' | 'active' | ExternalStepStatus;

export type InternalStepProps<T> = {
	key: string;
	name: string;
	status: InternalStepStatus;
	editPath?: string;
	Summary: React.FC<T>;
	Form: React.FC<T>;
	props: T;
};

const labelForStatus = (status: ExternalStepStatus) => {
	switch (status) {
		case 'incomplete':
			return 'Missing information';
		case 'complete':
			return 'Complete';
		case 'attentionNeeded':
			return 'Attention needed';
		case 'exempt':
			return '';
	}
};

export default function Step<T>({
	name,
	status,
	editPath,
	Summary,
	Form,
	props,
}: InternalStepProps<T>) {
	return (
		<li className={`oec-step-list__step oec-step-list__step--${status}`}>
			<div className="oec-step-list__step__content">
				<h2 className="oec-step-list__step__title">{name}</h2>

				{status !== 'notStarted' && status !== 'active' && (
					<div className="oec-step-list__step__summary">
						<Summary {...props} />
					</div>
				)}
				{status === 'active' && (
					<div className="oec-step-list__step__form">
						<Form {...props} />
					</div>
				)}
			</div>
			{status !== 'exempt' && (
				<div className="oec-step-list__step__actions">
					{status !== 'notStarted' && status !== 'active' && (
						<>
							<div className="oec-step-list__step__status-text">
								<InlineIcon icon={status} provideScreenReaderFallback={false} />
								{labelForStatus(status)}
							</div>
							{editPath && (
								<Link to={editPath}>
									Edit<span className="usa-sr-only"> {name.toLowerCase()}</span>
								</Link>
							)}
						</>
					)}
				</div>
			)}
		</li>
	);
}
