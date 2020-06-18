import React from 'react';
import { SectionProps } from '../../enrollmentTypes';
import { getCurrentCdcFunding, getCurrentC4kCertificate, prettyAge, prettyFundingSpaceTime, reportingPeriodFormatter } from '../../../../utils/models';
import idx from 'idx';
import { InlineIcon } from '../../../../components';
import dateFormatter from '../../../../utils/dateFormatter';

export const Summary: React.FC<SectionProps> = ({ enrollment }) => {
		if (!enrollment) return <></>;


		const child = enrollment.child;
		const fundings = enrollment.fundings || [];
		const cdcFunding = getCurrentCdcFunding(fundings);

		const c4kFunding = getCurrentC4kCertificate(enrollment);
		const receivesC4k = c4kFunding !== undefined;

		return (
			<div className="EnrollmentFundingSummary">
				{enrollment && (
					<>
						<p>Site: {idx(enrollment, (_) => _.site.name)} </p>
						<p>
							Age group:{' '}
							{enrollment.ageGroup
								? prettyAge(enrollment.ageGroup)
								: InlineIcon({ icon: 'incomplete' })}
						</p>
						<p>
							{' '}
							Enrollment date:{' '}
							{enrollment.entry
								? dateFormatter(enrollment.entry)
								: InlineIcon({ icon: 'incomplete' })}{' '}
						</p>
						<p>
							Funding:{' '}
							{!cdcFunding
								? 'Private pay'
								: `CDC - ${prettyFundingSpaceTime(cdcFunding.fundingSpace)}`}
						</p>
						{!!cdcFunding && (
							<p>
								First reporting period: {reportingPeriodFormatter(cdcFunding.firstReportingPeriod)}
							</p>
						)}
						{receivesC4k && c4kFunding && (
							<>
								<p>
									Care 4 Kids Family ID:{' '}
									{child?.c4KFamilyCaseNumber
										? child.c4KFamilyCaseNumber
										: InlineIcon({ icon: 'incomplete' })}
								</p>
								<p>
									Care 4 Kids Certificate Start Date:{' '}
									{c4kFunding.startDate
										? dateFormatter(c4kFunding.startDate)
										: InlineIcon({ icon: 'incomplete' })}
								</p>
							</>
						)}
					</>
				)}
			</div>
		);
	}
