// Variables used in jest mockes -- must start with `mock`
import {
	mockAllFakeEnrollments,
	mockSite,
	mockReport,
	mockSingleSiteOrganization,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete,
	mockApiOrganizationsOrgIdSitesIdGet,
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut,
	mockApiOrganizationsOrgIdReportsGet,
	mockApiOrganizationsIdGet,
} from '../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsIdGet: mockApiOrganizationsIdGet(mockSingleSiteOrganization),
		apiOrganizationsOrgIdReportsGet: mockApiOrganizationsOrgIdReportsGet([mockReport]),
		apiOrganizationsOrgIdSitesIdGet: mockApiOrganizationsOrgIdSitesIdGet(mockSite),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
			mockAllFakeEnrollments
		),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(
			mockAllFakeEnrollments
		),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete(),
	})
);

import React from 'react';
import { createMemoryHistory } from 'history';
import { render, fireEvent, wait } from '@testing-library/react';
import { Route } from 'react-router';

import 'react-dates/initialize';
import mockdate from 'mockdate';

import TestProvider from '../../../contexts/__mocks__/TestProvider';
import { mockCompleteEnrollment, mockEnrollmentWithFoster } from '../../../tests/data';

import EnrollmentNew from './EnrollmentNew';
import FamilyIncome from '../_sections/FamilyIncome';
import EnrollmentFunding from '../_sections/EnrollmentFunding';
import { accessibilityTestHelper } from '../../../tests/helpers';

const fakeDate = '2019-03-02';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

const history = createMemoryHistory();

describe('EnrollmentNew', () => {
	describe('FamilyIncome', () => {
		it('matches snapshot', () => {
			const { asFragment } = render(
				<TestProvider>
					<EnrollmentNew
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

		it('does not skip family income section when lives with foster family is not selected', async () => {
			const { getByText } = render(
				<TestProvider>
					<EnrollmentNew
						history={history}
						match={{
							params: {
								siteId: 1,
								enrollmentId: mockCompleteEnrollment.id,
								sectionId: 'family-information',
							},
						}}
					/>
				</TestProvider>
			);

			const saveBtn = getByText(/Save/i);
			fireEvent.click(saveBtn);

			await wait();

			expect(history.location.pathname).toMatch(/family-income/i);
		});

		it('skips family income section when lives with foster family is selected', async () => {
			history.push(
				`/roster/sites/${mockEnrollmentWithFoster.siteId}/enrollments/${mockEnrollmentWithFoster.id}/new/family-information`
			);

			const { findByLabelText, getByText } = render(
				<TestProvider history={history}>
					<Route
						path={'/roster/sites/:siteId/enrollments/:enrollmentId/new/:sectionId'}
						render={(props) => (
							<EnrollmentNew
								history={props.history}
								match={{
									params: {
										siteId: props.match.params.siteId,
										enrollmentId: mockEnrollmentWithFoster.id,
										sectionId: props.match.params.sectionId,
									},
								}}
							/>
						)}
					/>
				</TestProvider>
			);

			const fosterCheckbox = await findByLabelText(/Child lives with foster family/i);
			expect((fosterCheckbox as HTMLInputElement).checked).toBeTruthy();

			const saveBtn = getByText(/Save/i);
			fireEvent.click(saveBtn);

			await wait(() => expect(history.location.pathname).toMatch(/enrollment-funding/i));
		});
	});

	describe('EnrollmenFunding', () => {
		it('matches snapshot', () => {
			const { asFragment } = render(
				<TestProvider>
					<EnrollmentNew
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
				<EnrollmentNew
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
