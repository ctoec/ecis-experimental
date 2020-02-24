import React from 'react';
import { Funding, FundingSource } from '../generated';

export type LegendTextFormatter = (
	fullTitle: string,
	enrolledForFunding?: number,
	capacityForFunding?: number,
	showPastEnrollments?: boolean
) => string | JSX.Element;

type FundingSourceDetail = {
	fullTitle: string;
	colorToken?: string;
	tagFormatter: (funding: Funding) => string;
	legendTextFormatter: LegendTextFormatter;
};

function ptOrFT(fundingTime: string | undefined) {
	if (fundingTime === 'Full') {
		return '–FT';
	}
	if (fundingTime === 'Part') {
		return '–PT';
	}
	return '';
}

// These colors are placeholders and will change
export const fundingSourceDetails: { [key: string]: FundingSourceDetail } = {
	CDC: {
		colorToken: 'blue-50v',
		fullTitle: 'Child Day Care',
		tagFormatter: funding => `CDC${ptOrFT(funding.time)}`,
		legendTextFormatter: (
			fullTitle,
			enrolledForFunding,
			capacityForFunding,
			showPastEnrollments
		) => {
			if (showPastEnrollments) {
				return (
					<React.Fragment>
						<span className="text-bold">{enrolledForFunding}</span>
						<span> recieved {fullTitle} funding</span>
					</React.Fragment>
				);
			}

			return (
				<React.Fragment>
					<span className="text-bold">
						{enrolledForFunding}/{capacityForFunding}
					</span>
					<span> {fullTitle} spaces filled</span>
				</React.Fragment>
			);
		},
	},
	C4K: {
		colorToken: 'violet-warm-60',
		fullTitle: 'Care 4 Kids',
		tagFormatter: funding => 'C4K',
		legendTextFormatter: (fullTitle, enrolledForFunding, _, showPastEnrollments) => {
			return (
				<React.Fragment>
					<span className="text-bold">{enrolledForFunding}</span>
					<span>
						{' '}
						{showPastEnrollments ? 'recieved' : 'receiving'} {fullTitle}
					</span>
				</React.Fragment>
			);
		},
	},
};

export default function getColorForFundingSource(source: FundingSource) {
	return fundingSourceDetails[source].colorToken;
}
