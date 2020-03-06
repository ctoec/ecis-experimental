// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockSite } from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete,
	mockApiOrganizationsOrgIdSitesIdGet,
} from '../../../hooks/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdSitesIdGet: mockApiOrganizationsOrgIdSitesIdGet(mockSite),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
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

const fakeDate = '2019-03-02';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

describe('EnrollmentNew', () => {
	it('does not skip family income section when lives with foster family is not selected', async () => {
		const history = createMemoryHistory();
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
		const history = createMemoryHistory();
		const enrollment = mockEnrollmentWithFoster;
		history.push(
			`/roster/sites/${enrollment.siteId}/enrollments/${enrollment.id}/new/family-information`
		);
		const { findByLabelText, getByDisplayValue } = render(
			<TestProvider history={history}>
				<Route
					path={'/roster/sites/:siteId/enrollments/:enrollmentId/new/:sectionId'}
					render={props => (
						<EnrollmentNew
							history={props.history}
							match={{
								params: {
									siteId: props.match.params.siteId,
									// Throws 'TypeError: Invalid attempt to destructure non-iterable instance' if we try to read from the props
									// I have no idea why??
									enrollmentId: enrollment.id,
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

		const saveBtn = getByDisplayValue(/Save/i);
		fireEvent.click(saveBtn);

		await wait();

		expect(history.location.pathname).toMatch(/enrollment-funding/i);
	});
});
