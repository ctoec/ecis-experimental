// Variables used in jest mockes -- must start with `mock`
import {
	mockAllFakeEnrollments,
	mockCompleteEnrollment,
	mockEnrollmentMissingBirthCertId,
	mockSite,
} from '../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut,
	mockApiOrganizationsOrgIdSitesIdGet,
} from '../../hooks/useApi/__mocks__/useApi';
import { accessibilityTestHelper } from '../../tests/helpers';
import TestProvider from '../../contexts/__mocks__/TestProvider';

// Jest mocks must occur before later imports
jest.mock('../../hooks/useApi', () => {
	return mockUseApi({
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
			mockAllFakeEnrollments
		),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(
			mockAllFakeEnrollments
		),
		apiOrganizationsOrgIdSitesIdGet: mockApiOrganizationsOrgIdSitesIdGet(mockSite),
	});
});

import React from 'react';
import { render, wait } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import 'react-dates/initialize';
import mockdate from 'mockdate';
import Withdrawal from './Withdrawal';
import { nameFormatter } from '../../utils/stringFormatters';

const fakeDate = '2019-09-30';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

describe('Withdrawal', () => {
	it('matches snapshot', async () => {
		const history = createMemoryHistory();
		const { asFragment } = render(
			<TestProvider>
				<Withdrawal
					history={history}
					match={{
						params: {
							siteId: mockCompleteEnrollment.siteId,
							enrollmentId: mockCompleteEnrollment.id,
						},
					}}
				/>
			</TestProvider>
		);
		await wait(() => expect(asFragment()).toMatchSnapshot());
	});

	it('shows a header with the child name', async () => {
		const history = createMemoryHistory();
		const { findByText } = render(
			<TestProvider>
				<Withdrawal
					history={history}
					match={{
						params: {
							siteId: mockCompleteEnrollment.siteId,
							enrollmentId: mockCompleteEnrollment.id,
						},
					}}
				/>
			</TestProvider>
		);
		await wait(() => findByText(`Withdraw ${nameFormatter(mockCompleteEnrollment.child)}`));
	});

	it('navigates to enrollment edit if information is missing', async () => {
		const history = createMemoryHistory();
		render(
			<TestProvider>
				<Withdrawal
					history={history}
					match={{
						params: {
							siteId: mockEnrollmentMissingBirthCertId.siteId,
							enrollmentId: mockEnrollmentMissingBirthCertId.id,
						},
					}}
				/>
			</TestProvider>
		);
		await wait(() =>
			expect(history.location.pathname).toMatch(
				`/roster/sites/${mockEnrollmentMissingBirthCertId.siteId}/enrollments/${mockEnrollmentMissingBirthCertId.id}`
			)
		);
	});

	accessibilityTestHelper(
		<TestProvider>
			<Withdrawal
				history={createMemoryHistory()}
				match={{
					params: {
						siteId: mockCompleteEnrollment.siteId,
						enrollmentId: mockCompleteEnrollment.id,
					},
				}}
			/>
		</TestProvider>
	);
});
