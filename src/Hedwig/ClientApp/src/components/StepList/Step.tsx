import React from 'react';
import { Link } from 'react-router-dom';
import { InlineIcon } from '..';
import cx from 'classnames';

export type ExternalStepStatus = 'incomplete' | 'complete' | 'attentionNeeded' | 'exempt';

export type InternalStepStatus = 'notStarted' | 'active' | ExternalStepStatus;

export type PossibleHeaderLevels = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type InternalStepProps<T> = {
	key: string;
	name: string;
	status: InternalStepStatus;
	editPath?: string;
	Summary: React.FC<T>;
	Form: React.FC<T>;
	props: T;
	headerLevel: PossibleHeaderLevels;
	type?: 'normal' | 'embedded';
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
	headerLevel,
	type = 'normal',
}: InternalStepProps<T>) {
	const Heading = headerLevel;
	return (
		<li
			className={cx('oec-step-list__step', `oec-step-list__step--${status}`, {
				embedded: type === 'embedded',
			})}
		>
			<div className="oec-step-list__step__content">
				<Heading className="oec-step-list__step__title">{name}</Heading>

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
								<Link to={editPath} className="usa-link">
									{/* https://silktide.com/blog/2013/i-thought-title-text-improved-accessibility-i-was-wrong */}
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
