import React from 'react';
import { Organization, Enrollment, FundingSource } from '../generated';
import { DeepNonUndefineable } from './types';
import { isFunded, currentC4kCertificate, getFundingSpaceCapacity } from './models';
import { getDisplayColorForFundingType, FundingTypes } from './fundingType';

export type LegendTextFormatter = (
	organization: Organization,
	enrollments: DeepNonUndefineable<Enrollment[]>,
	showPastEnrollments?: boolean
) => string | JSX.Element;

type LegendDisplayDetail = {
	fullTitle: string;
	shortTitle: string;
	colorToken?: string;
	legendTextFormatter: LegendTextFormatter;
	hidden: (organization: Organization, enrollments: DeepNonUndefineable<Enrollment[]>) => boolean;
};

// These colors are placeholders and will change
export const legendDisplayDetails: { [LegendDisplayKey in FundingTypes]: LegendDisplayDetail } = {
	CDC: {
		colorToken: getDisplayColorForFundingType('CDC'),
		fullTitle: 'Child Day Care',
		shortTitle: 'CDC',
		legendTextFormatter: (organization, enrollments, showPastEnrollments) => {
			const enrolledForCdc = enrollments.filter(enrollment =>
				isFunded(enrollment, { source: FundingSource.CDC })
			).length;
			const cdcCapacity = getFundingSpaceCapacity(organization, { source: FundingSource.CDC });
			const fullTitle = legendDisplayDetails['CDC'].fullTitle;
			if (showPastEnrollments) {
				return (
					<React.Fragment>
						<span className="text-bold">{enrolledForCdc}</span>
						<span> recieved {fullTitle} funding</span>
					</React.Fragment>
				);
			} else {
				return (
					<React.Fragment>
						<span className="text-bold">
							{enrolledForCdc}/{cdcCapacity}
						</span>
						<span> {fullTitle} spaces filled</span>
					</React.Fragment>
				);
			}
		},
		hidden: (_, enrollments) =>
			enrollments.filter(enrollment => isFunded(enrollment, { source: FundingSource.CDC }))
				.length === 0,
	},
	C4K: {
		colorToken: getDisplayColorForFundingType('C4K'),
		fullTitle: 'Care 4 Kids',
		shortTitle: 'C4K',
		legendTextFormatter: (_, enrollments, showPastEnrollments) => {
			const enrolledWithC4k = enrollments.filter(enrollment => !!currentC4kCertificate(enrollment))
				.length;
			const fullTitle = legendDisplayDetails['C4K'].fullTitle;
			return (
				<React.Fragment>
					<span className="text-bold">{enrolledWithC4k}</span>
					<span>
						{' '}
						{showPastEnrollments ? 'recieved' : 'receiving'} {fullTitle}
					</span>
				</React.Fragment>
			);
		},
		hidden: (_, enrollments) =>
			enrollments.filter(enrollment => !!currentC4kCertificate(enrollment)).length === 0,
	},
};
