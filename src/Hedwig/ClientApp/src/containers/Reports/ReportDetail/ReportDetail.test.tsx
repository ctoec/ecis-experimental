// Variables used in jest mocks -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
	mockSingleSiteOrganization,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
	mockApiOrganizationsIdGet,
} from '../../../hooks/useApi/__mocks__/useApi';

let mockReport = mockDefaultReport;

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () => ({
	// When trying to mock both a default import and named import,
	// we must specify __esModule: true on the returned object.
	__esModule: true,
	default: mockUseApi({
		apiOrganizationsOrgIdEnrollmentsGet: mockApiOrganizationsOrgIdEnrollmentsGet([
			mockCompleteEnrollment,
			mockEnrollmentWithFoster,
		]),
		apiOrganizationsOrgIdReportsIdGet: (_: any) => ({
			data: mockReport,
		}),
		apiOrganizationsOrgIdReportsIdPut: (_: any) => ({ data: mockReport }),
		apiOrganizationsIdGet: (_: any) => mockApiOrganizationsIdGet(mockSingleSiteOrganization)(_),
	}),
	paginate: (_: any, __: any) => _,
}));

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: 1,
		orgId: 1,
	}),
}));

import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import ReportDetail from './ReportDetail';
import TestProvider from '../../../contexts/__mocks__/TestProvider';
import { accessibilityTestHelper } from '../../../tests/helpers';
import { createMemoryHistory } from 'history';

afterAll(() => {
	jest.resetModules();
});

describe('ReportDetail', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<TestProvider>
				<ReportDetail />
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	describe('when roster is missing information', () => {
		beforeEach(() => {
			mockReport = mockDefaultReport;
		});
		it('shows an alert and disables submit', () => {
			const history = createMemoryHistory();
			history.push('#revenue');
			const { getByText, getByRole } = render(
				<TestProvider history={history}>
					<ReportDetail />
				</TestProvider>
			);

			expect(getByRole('alert')).toHaveTextContent('Update roster');
			expect(getByText('Submit')).toHaveAttribute('disabled');
		});
	});

	describe('when report is ready to be submitted', () => {
		beforeEach(() => {
			mockReport = _mockReport;
		});

		it('allows the report to be submitted', async () => {
			const history = createMemoryHistory();
			history.push('#revenue');
			const { getByText, getByLabelText } = render(
				<TestProvider history={history}>
					<ReportDetail />
				</TestProvider>
			);

			fireEvent.change(getByLabelText(/Care 4 Kids/), { target: { value: '1234.56' } });
			fireEvent.change(getByLabelText('Family Fees'), { target: { value: '1234.56' } });
			expect(getByText('Submit').hasAttribute('disabled')).toEqual(false);
		});
	});

	it('updates rates if accreditation is changed', () => {
		const history = createMemoryHistory();
		history.push('#revenue');
		const { getAllByText, getByLabelText } = render(
			<TestProvider history={history}>
				<ReportDetail />
			</TestProvider>
		);

		expect(getAllByText('Preschool')[0].closest('tr')).toHaveTextContent('165.32');

		fireEvent.click(getByLabelText(/accredited/));

		expect(getAllByText('Preschool')[0].closest('tr')).toHaveTextContent('126.59');
	});

	accessibilityTestHelper(
		<TestProvider>
			<ReportDetail />
		</TestProvider>
	);
});
