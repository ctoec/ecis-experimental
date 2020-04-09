import { Site, Region, FundingSource, Age, FundingTime } from '../../generated';

const mockSingleSiteOrganization = {
	id: 1,
	name: 'Test Organization',
	fundingSpaces: [
		{
			source: FundingSource.CDC,
			ageGroup: Age.Preschool,
			fundingTimeAllocations: [{ time: FundingTime.Full, weeks: 52 }],
			capacity: 2,
			organizationId: 1,
		},
	],
	sites: [
		{
			id: 1,
			name: 'Test Site',
			region: Region.East,
			titleI: false,
			organizationId: 1,
		},
	],
};

export const mockSite: Site = {
	id: 1,
	name: "Children's Adventure Center",
	organizationId: 1,
	enrollments: undefined,
	organization: mockSingleSiteOrganization,
	titleI: false,
	region: Region.East,
};

export const mockAnotherSite: Site = {
	id: 2,
	name: "Children's Adventure Center",
	organizationId: 1,
	enrollments: undefined,
	organization: mockSingleSiteOrganization,
	titleI: false,
	region: Region.East,
};
