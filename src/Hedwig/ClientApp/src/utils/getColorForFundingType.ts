import { FundingSource } from '../OAS-generated';

type FundingSourceDetail = {
	fullTitle: string;
	colorToken?: string;
};

// These colors are placeholders and will change
export const fundingSourceDetails: { [key: string]: FundingSourceDetail } = {
	CDC: {
		colorToken: 'blue-30v',
		fullTitle: 'Child Daycare Center',
	},
	SRS: {
		colorToken: 'violet-warm-30',
		fullTitle: 'School Readiness',
	},
	C4K: {
		colorToken: 'green-cool-30',
		fullTitle: 'Care 4 Kids',
	},
};

export default function getColorForFundingSource(source: FundingSource) {
	return fundingSourceDetails[source].colorToken;
}
