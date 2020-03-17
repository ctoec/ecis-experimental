// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockSite } from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesIdGet,
} from '../../../hooks/__mocks__/useApi';

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
import mockdate from 'mockdate';
import { createBrowserHistory } from 'history';
import { render, getAllByRole } from '@testing-library/react';
import 'react-dates/initialize';
import TestProvider from '../../../contexts/__mocks__/TestProvider';
import EnrollmentEdit from './EnrollmentEdit';
import { accessibilityTestHelper } from '../../../tests/helpers';
import {
	mockCompleteEnrollment,
	cdcReportingPeriods,
	mockEnrollmentMissingAddress,
} from '../../../tests/data';

const fakeDate = '2019-03-02';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

const history = createBrowserHistory();

describe('EnrollmentEdit', () => {
	describe('family info', () => {
		it('shows a fieldset warning if there is no address', () => {
			const { getByRole } = render(
				<TestProvider>
					<EnrollmentEdit
						history={history}
						match={{
							params: {
								siteId: mockEnrollmentMissingAddress.siteId,
								enrollmentId: mockEnrollmentMissingAddress.id,
								sectionId: 'family-information',
							},
						}}
					/>
				</TestProvider>
			);

			const addressErr = getByRole('status');

			expect(addressErr.classList.contains('usa-warning-message'));
		});
	});

	describe('family income', () => {
		it('shows an info alert if family income is not disclosed', () => {
			const { getByText } = render(
				<TestProvider>
					<EnrollmentEdit
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

			const infoAlert = getByText(
				'Income information is required to enroll a child in a CDC funded space. You will not be able to assign this child to a funding space without this information.'
			);

			expect(infoAlert).toBeInTheDocument();
		});
	});

	describe('enrollment and funding', () => {
		it('shows the appropriate number of reporting periods for enrollment funding', () => {
			const { getByLabelText } = render(
				<TestProvider>
					<EnrollmentEdit
						history={history}
						match={{
							params: {
								siteId: mockCompleteEnrollment.siteId,
								enrollmentId: mockCompleteEnrollment.id,
								sectionId: 'enrollment-funding',
							},
						}}
					/>
				</TestProvider>
			);
			const reportingPeriodSelect = getByLabelText('First reporting period');
			const reportingPeriodOptions = getAllByRole(reportingPeriodSelect, 'option');
			expect(reportingPeriodOptions.length).toBe(cdcReportingPeriods.length + 1);
		});
	});

	accessibilityTestHelper(
		<TestProvider>
			<EnrollmentEdit
				history={history}
				match={{
					params: {
						siteId: mockCompleteEnrollment.siteId,
						enrollmentId: mockCompleteEnrollment.id,
						sectionId: 'enrollment-funding',
					},
				}}
			/>
		</TestProvider>
	);
});
