import { Funding } from '../generated/models/Funding';
import { FundingSource } from '../generated';

type FundingSourceDetail = {
	fullTitle: string;
	colorToken?: string;
	textFormatter: (funding: Funding) => string;
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
		fullTitle: 'Child Day Care spaces filled',
		textFormatter: funding => `CDC${ptOrFT(funding.time)}`,
	},
	C4K: {
		colorToken: 'violet-warm-60',
		fullTitle: 'receiving Care 4 Kids',
		textFormatter: funding => 'C4K',
	},
	// SRS: {
	// 	colorToken: 'gray or something idk',
	// 	fullTitle: 'School Readiness',
	// 	textFormatter: funding => 'SRS'
	// },
};

export default function getColorForFundingSource(source: FundingSource) {
	return fundingSourceDetails[source].colorToken;
}
