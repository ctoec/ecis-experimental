// Variables used in jest mockes -- must start with `mock`
import {
	mockAllFakeEnrollments,
	mockSite,
	mockReport,
	mockSingleSiteOrganization,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesIdGet,
	mockApiOrganizationsOrgIdReportsGet,
	mockApiOrganizationsIdGet,
} from '../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsIdGet: mockApiOrganizationsIdGet(mockSingleSiteOrganization),
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
	describe('FamilyInfo', () => {
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

	describe('EnrollmentFunding', () => {
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
	});
});
