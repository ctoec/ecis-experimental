import { FundingSource } from '../generated/globalTypes';

type FundingSourceDetail = {
  fullTitle: string;
	colorToken?: string;
};

// These colors are placeholders and will change
export const fundingSourceDetails: { [key: string]: FundingSourceDetail } = {
	CDC: {
		colorToken: 'blue-cool-70v',
		fullTitle: 'Child Daycare Center',
	},
	SRS: {
		colorToken: 'green',
		fullTitle: 'School Readiness',
	},
	C4K: {
		colorToken: 'purple',
		fullTitle: 'Care 4 Kids',
	},
};

export default function getColorForFundingSource(source: FundingSource) {
	return fundingSourceDetails[source].colorToken;
}
