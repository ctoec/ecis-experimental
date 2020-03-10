import { FundingSource, Age, FundingTime, Region } from '../../generated';
import { swapFields } from '../helpers';
import { mockSite, mockAnotherSite } from './site';

export const mockSingleSiteOrganization = {
	id: 1,
	name: 'Test Organization',
	fundingSpaces: [
		{
			source: FundingSource.CDC,
			ageGroup: Age.Preschool,
			time: FundingTime.Full,
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

export const mockMultiSiteOrganization = swapFields(mockSingleSiteOrganization, [
	{
		keys: ['sites'],
		newValue: [mockSite, mockAnotherSite],
	},
]);
