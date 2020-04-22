import { FundingSource, Age, FundingTime, FundingSpace } from '../../generated';

export const fundingSpaces: FundingSpace[] = [];

Object.values(Age).forEach(ageGroup => {
	Object.values(FundingSource).forEach(source => {
		// This is just CDC for now
		fundingSpaces.push({
			source,
			ageGroup,
			fundingTimeAllocations: [{ time: FundingTime.Full, weeks: 52 }],
			capacity: 10,
			organizationId: 1,
		});
	});
});

fundingSpaces.push({
	source: FundingSource.CDC,
	ageGroup: Age.Preschool,
	fundingTimeAllocations: [{ time: FundingTime.Part, weeks: 52 }],
	capacity: 10,
	organizationId: 1,
});
