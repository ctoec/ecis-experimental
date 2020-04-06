// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockSite } from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesIdGet,
} from '../../../hooks/__mocks__/newUseApi';

// Jest mocks must occur before later imports
jest.mock('../../../hooks/newUseApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdSitesIdGet: mockApiOrganizationsOrgIdSitesIdGet(mockSite),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
			mockAllFakeEnrollments
		),
	})
);

import React from 'react';
import { render } from '@testing-library/react';
import TestProvider from '../../../contexts/__mocks__/TestProvider';
import { mockCompleteEnrollment, mockEnrollmentMissingBirthCertId } from '../../../tests/data';
import { accessibilityTestHelper } from '../../../tests/helpers';
import EnrollmentUpdate from './EnrollmentUpdate';
import { createMemoryHistory } from 'history';

afterAll(() => {
	jest.resetModules();
});

describe('EnrollmentUpdate', () => {
	it('matches snapshot', () => {
		const history = createMemoryHistory();
		const { asFragment } = render(
			<TestProvider history={history}>
				<EnrollmentUpdate
					history={history}
					match={{
						params: {
							siteId: mockCompleteEnrollment.siteId,
							enrollmentId: mockCompleteEnrollment.id,
							sectionId: 'family-income',
						},
					}}
				/>
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	const history = createMemoryHistory();
	accessibilityTestHelper(
		<TestProvider history={history}>
			<EnrollmentUpdate
				history={history}
				match={{
					params: {
						siteId: mockEnrollmentMissingBirthCertId.siteId,
						enrollmentId: mockEnrollmentMissingBirthCertId.id,
						sectionId: 'family-income',
					},
				}}
			/>
		</TestProvider>
	);
});
