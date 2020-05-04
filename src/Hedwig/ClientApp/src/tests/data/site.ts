import { Site, Region } from '../../generated';
import { mockFundingSpaces } from './fundingSpace';

const sitelessOrganization = {
	id: 1,
	name: 'Test Organization',
	fundingSpaces: mockFundingSpaces,
};

export const mockSite: Site = {
	id: 1,
	name: "Children's Adventure Center",
	organizationId: 1,
	enrollments: undefined,
	organization: sitelessOrganization,
	titleI: false,
	region: Region.East,
};

export const mockAnotherSite: Site = {
	id: 2,
	name: "Children's Adventure Center",
	organizationId: 1,
	enrollments: undefined,
	organization: sitelessOrganization,
	titleI: false,
	region: Region.East,
};
