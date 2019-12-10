import React from 'react';
import { Funding } from '../OAS-generated/models/Funding';
import { FundingSource } from '../OAS-generated';

export type LegendTextFormatter = (
	fullTitle: string,
	enrolledForFunding?: number,
	capacityForFunding?: number
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
		legendTextFormatter: (fullTitle, enrolledForFunding, capacityForFunding) => {
			return (
				<React.Fragment>
					<span className="text-bold">
						{enrolledForFunding}/{capacityForFunding}
					</span>
					<span>{fullTitle} spaces filled</span>
				</React.Fragment>
			);
		},
	},
	C4K: {
		colorToken: 'violet-warm-60',
		fullTitle: 'Care 4 Kids',
		tagFormatter: funding => 'C4K',
		legendTextFormatter: (fullTitle, enrolledForFunding) => (
			<React.Fragment>
				<span className="text-bold">{enrolledForFunding}</span>
				<span>receiving {fullTitle}</span>
			</React.Fragment>
		),
	},
	// SRS: {
	// 	colorToken: 'gray or something idk',
	// 	fullTitle: 'School Readiness',
	// 	tagFormatter: funding => 'SRS'
	// },
};

export default function getColorForFundingSource(source: FundingSource) {
	return fundingSourceDetails[source].colorToken;
}
