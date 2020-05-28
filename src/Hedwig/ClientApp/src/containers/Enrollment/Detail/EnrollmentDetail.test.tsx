// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockSite } from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesIdGet,
} from '../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdSitesIdGet: mockApiOrganizationsOrgIdSitesIdGet(mockSite),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
			mockAllFakeEnrollments
		),
	})
);

import React from 'react';
import { render } from '@testing-library/react';
import EnrollmentDetail from './EnrollmentDetail';
import TestProvider from '../../../contexts/__mocks__/TestProvider';
import { mockCompleteEnrollment, mockEnrollmentMissingBirthCertId } from '../../../tests/data';
import { accessibilityTestHelper } from '../../../tests/helpers';

afterAll(() => {
	jest.resetModules();
});

describe('EnrollmentDetail', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<TestProvider>
				<EnrollmentDetail
					match={{
						params: {
							siteId: mockCompleteEnrollment.siteId,
							enrollmentId: mockCompleteEnrollment.id,
						},
					}}
				/>
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('shows incomplete indications when incomplete information is given', () => {
		const { getAllByText } = render(
			<TestProvider>
				<EnrollmentDetail
					match={{
						params: {
							siteId: mockEnrollmentMissingBirthCertId.siteId,
							enrollmentId: mockEnrollmentMissingBirthCertId.id,
						},
					}}
				/>
			</TestProvider>
		);

		const incompleteIcons = getAllByText('(incomplete)');
		expect(incompleteIcons.length).toBe(1);
	});

	accessibilityTestHelper(
		<TestProvider>
			<EnrollmentDetail
				match={{
					params: {
						siteId: mockEnrollmentMissingBirthCertId.siteId,
						enrollmentId: mockEnrollmentMissingBirthCertId.id,
					},
				}}
			/>
		</TestProvider>
	);
});
