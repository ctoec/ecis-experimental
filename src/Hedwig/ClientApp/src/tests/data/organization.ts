import { swapFields } from '../helpers';
import { mockSite, mockAnotherSite } from './site';
import { FundingSource, Age, FundingTime, Region, Organization } from '../../generated';

export const mockSingleSiteOrganization = {
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
} as Organization;

export const mockMultiSiteOrganization = swapFields(mockSingleSiteOrganization, [
	{
		keys: ['sites'],
		newValue: [mockSite, mockAnotherSite],
	},
]);
