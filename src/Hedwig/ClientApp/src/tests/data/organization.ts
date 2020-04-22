import { swapFields } from '../helpers';
import { mockSite, mockAnotherSite } from './site';
import { fundingSpaces } from './fundingSpace';
import { FundingSource, Age, FundingTime, Region, Organization } from '../../generated';

export const mockSingleSiteOrganization = {
	id: 1,
	name: 'Test Organization',
	fundingSpaces,
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
