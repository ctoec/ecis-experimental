import { FundingSource, Age, FundingTime, FundingSpace } from '../../generated';

export const mockFundingSpaces: FundingSpace[] = [];

const ages = Object.values(Age);
const firstAge = ages.pop();

ages.forEach(ageGroup => {
	Object.values(FundingSource).forEach(source => {
		// This is just CDC for now
		mockFundingSpaces.push({
			source,
			ageGroup,
			fundingTimeAllocations: [{ time: FundingTime.Full, weeks: 52 }],
			capacity: 10,
			organizationId: 1,
		});
	});
});

mockFundingSpaces.push({
	source: FundingSource.CDC,
	ageGroup: firstAge,
	fundingTimeAllocations: [
		{ time: FundingTime.Part, weeks: 52 },
		{ time: FundingTime.Full, weeks: 52 },
	],
	capacity: 10,
	organizationId: 1,
});
