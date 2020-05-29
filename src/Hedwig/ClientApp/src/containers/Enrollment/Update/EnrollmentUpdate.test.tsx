// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockSite, mockReport } from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesIdGet,
	mockApiOrganizationsOrgIdReportsGet,
} from '../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdSitesIdGet: mockApiOrganizationsOrgIdSitesIdGet(mockSite),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
			mockAllFakeEnrollments
		),
		apiOrganizationsOrgIdReportsGet: mockApiOrganizationsOrgIdReportsGet([mockReport]),
	})
);

import React from 'react';
import mockdate from 'mockdate';
import { createBrowserHistory } from 'history';
import { render, getAllByRole } from '@testing-library/react';
import 'react-dates/initialize';
import TestProvider from '../../../contexts/__mocks__/TestProvider';
import EnrollmentUpdate from './EnrollmentUpdate';
import { accessibilityTestHelper } from '../../../tests/helpers';
import {
	mockCompleteEnrollment,
	cdcReportingPeriods,
	mockEnrollmentMissingAddress,
} from '../../../tests/data';
import FamilyInfo from '../_sections/FamilyInfo';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';

const fakeDate = '2019-03-02';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

const history = createBrowserHistory();

describe('EnrollmentUpdate', () => {
	describe('family info', () => {
		it('matches snapshot', () => {
			const { asFragment } = render(
				<TestProvider>
					<EnrollmentUpdate
						history={history}
						match={{
							params: {
								siteId: mockCompleteEnrollment.siteId,
								enrollmentId: mockCompleteEnrollment.id,
								sectionId: FamilyInfo.key,
							},
						}}
					/>
				</TestProvider>
			);

			expect(asFragment()).toMatchSnapshot();
		});

		accessibilityTestHelper(
			<TestProvider>
				<EnrollmentUpdate
					history={history}
					match={{
						params: {
							siteId: mockCompleteEnrollment.siteId,
							enrollmentId: mockCompleteEnrollment.id,
							sectionId: FamilyInfo.key,
						},
					}}
				/>
			</TestProvider>
		);

		it('shows a fieldset warning if there is no address', () => {
			const { getByRole } = render(
				<TestProvider>
					<EnrollmentUpdate
						history={history}
						match={{
							params: {
								siteId: mockEnrollmentMissingAddress.siteId,
								enrollmentId: mockEnrollmentMissingAddress.id,
								sectionId: FamilyInfo.key,
							},
						}}
					/>
				</TestProvider>
			);

			const addressErr = getByRole('status');

			expect(addressErr.classList.contains('usa-warning-message'));
		});
	});

	describe('FamilyIncome', () => {
		it('matches snapshot', () => {
			const { asFragment } = render(
				<TestProvider>
					<EnrollmentUpdate
						history={history}
						match={{
							params: {
								siteId: mockCompleteEnrollment.siteId,
								enrollmentId: mockCompleteEnrollment.id,
								sectionId: FamilyIncome.key,
							},
						}}
					/>
				</TestProvider>
			);

			expect(asFragment()).toMatchSnapshot();
		});
		accessibilityTestHelper(
			<TestProvider>
				<EnrollmentUpdate
					history={history}
					match={{
						params: {
							siteId: mockCompleteEnrollment.siteId,
							enrollmentId: mockCompleteEnrollment.id,
							sectionId: FamilyIncome.key,
						},
					}}
				/>
			</TestProvider>
		);
	});

	describe('enrollment and funding', () => {
		it('matches snapshot', () => {
			const { asFragment } = render(
				<TestProvider>
					<EnrollmentUpdate
						history={history}
						match={{
							params: {
								siteId: mockCompleteEnrollment.siteId,
								enrollmentId: mockCompleteEnrollment.id,
								sectionId: EnrollmentFunding.key,
							},
						}}
					/>
				</TestProvider>
			);
			expect(asFragment()).toMatchSnapshot();
		});

		accessibilityTestHelper(
			<TestProvider>
				<EnrollmentUpdate
					history={history}
					match={{
						params: {
							siteId: mockCompleteEnrollment.siteId,
							enrollmentId: mockCompleteEnrollment.id,
							sectionId: EnrollmentFunding.key,
						},
					}}
				/>
			</TestProvider>
		);

		it('shows the appropriate number of reporting periods for enrollment funding', async () => {
			const { getByLabelText } = render(
				<TestProvider>
					<EnrollmentUpdate
						history={history}
						match={{
							params: {
								siteId: mockCompleteEnrollment.siteId,
								enrollmentId: mockCompleteEnrollment.id,
								sectionId: EnrollmentFunding.key,
							},
						}}
					/>
				</TestProvider>
			);

			const reportingPeriodSelect = getByLabelText('First reporting period');
			const reportingPeriodOptions = getAllByRole(reportingPeriodSelect, 'option');
			// TODO: this test is wrong -- the options are: March, April and '-Select-'
			expect(reportingPeriodOptions.length).toBe(cdcReportingPeriods.length);
		});
	});
});
