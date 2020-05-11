import { swapFields } from '../helpers';
import { mockSite, mockAnotherSite } from './site';
import {
	mockFundingSpaces,
	mockSplitTimeInfantSpaceWithPreviousUtilizations,
} from './fundingSpace';
import { Region, Organization } from '../../generated';

export const mockSingleSiteOrganization = {
	id: 1,
	name: 'Test Organization',
	fundingSpaces: mockFundingSpaces,
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

export const mockSingleSiteOrganizationWithTimeSplitUtilizations = swapFields(
	mockSingleSiteOrganization,
	[
		{
			keys: ['fundingSpaces'],
			newValue: [mockSplitTimeInfantSpaceWithPreviousUtilizations],
		},
	]
);
