import { Funding } from '../OAS-generated/models/Funding';
import { FundingSource } from '../OAS-generated';

type FundingSourceDetail = {
	fullTitle: string;
	colorToken?: string;
	textFormatter: (funding: Funding) => string;
};

function ptOrFT(fundingTime: string | undefined) {
	if (fundingTime === 'Full') {
		return '-FT';
	}
	if (fundingTime === 'Part') {
		return '-PT';
	}
	return '';
}

// These colors are placeholders and will change
export const fundingSourceDetails: { [key: string]: FundingSourceDetail } = {
	CDC: {
		colorToken: 'blue-30v',
		fullTitle: 'Child Daycare Center',
		textFormatter: funding => `CDC${ptOrFT(funding.time)}`,
	},
	SRS: {
		colorToken: 'violet-warm-30',
		fullTitle: 'School Readiness',
		textFormatter: funding => 'SRS'
	},
	C4K: {
		colorToken: 'green-cool-30',
		fullTitle: 'Care 4 Kids',
		textFormatter: funding => 'C4K'
	},
};

export default function getColorForFundingSource(source: FundingSource) {
	return fundingSourceDetails[source].colorToken;
}
