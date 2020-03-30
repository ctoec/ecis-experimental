// Variables used in jest mockes -- must start with `mock`
import { mockAllFakeEnrollments, mockCompleteEnrollment } from '../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet,
	mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut,
} from '../../hooks/__mocks__/newUseApi';
import { accessibilityTestHelper } from '../../tests/helpers';
import TestProvider from '../../contexts/__mocks__/TestProvider';

// Jest mocks must occur before later imports
jest.mock('../../hooks/newUseApi', () => {
	return mockUseApi({
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet(
			mockAllFakeEnrollments
		),
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut: mockApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdPut(
			mockAllFakeEnrollments
		),
	});
});

let mockSiteId: number | undefined = 1;
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: mockSiteId,
	}),
}));

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
