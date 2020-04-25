import { FundingSource, Age, FundingTime, FundingSpace } from '../../generated';

export const mockFundingSpaces: FundingSpace[] = [];

const ages = [Age.Preschool, Age.SchoolAge];
// Use infant toddler for part full split

ages.forEach(ageGroup => {
	Object.values(FundingSource).forEach(source => {
		// This is just CDC for now
		mockFundingSpaces.push({
			id: mockFundingSpaces.length,
			source,
			ageGroup,
			fundingTimeAllocations: [
				{ time: FundingTime.Full, weeks: 52, fundingSpaceId: mockFundingSpaces.length },
			],
			capacity: 10,
			organizationId: 1,
		});
	});
});

export const mockSplitSpace = {
	id: mockFundingSpaces.length,
	source: FundingSource.CDC,
	ageGroup: Age.InfantToddler,
	fundingTimeAllocations: [
		{ time: FundingTime.Part, weeks: 50, fundingSpaceId: mockFundingSpaces.length },
		{ time: FundingTime.Full, weeks: 2, fundingSpaceId: mockFundingSpaces.length },
	],
	capacity: 10,
	organizationId: 1,
};

mockFundingSpaces.push(mockSplitSpace);
