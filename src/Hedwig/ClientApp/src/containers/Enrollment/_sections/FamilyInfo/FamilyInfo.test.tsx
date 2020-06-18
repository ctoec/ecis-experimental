// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockSite, mockReport } from '../../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesIdGet,
	mockApiOrganizationsOrgIdReportsGet,
} from '../../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdSitesIdGet: mockApiOrganizationsOrgIdSitesIdGet(mockSite),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
			mockAllFakeEnrollments
		),
		apiOrganizationsOrgIdReportsGet: mockApiOrganizationsOrgIdReportsGet([mockReport]),
	})
);

import React from 'react';
import { render } from '@testing-library/react';
import TestProvider from '../../../../contexts/__mocks__/TestProvider';
import { mockEnrollmentMissingAddress } from '../../../../tests/data';
import FamilyInfo from '.';

describe('enrollment sections', () => {
	describe('FamilyInfo', () => {
		it('shows a fieldset warning if there is no address', () => {
			const { getByRole } = render(
				<TestProvider>
					<FamilyInfo.Form
						siteId={1}
						enrollment={mockEnrollmentMissingAddress}
						updateEnrollment={jest.fn()}
						error={null}
					/>
				</TestProvider>
			);

			const addressErr = getByRole('status');

			expect(addressErr.classList.contains('usa-warning-message'));
		});
	});
});
