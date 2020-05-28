// Variables used in jest mocks -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
} from '../../../hooks/useApi/__mocks__/useApi';

let mockReport = mockDefaultReport;

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdEnrollmentsGet: mockApiOrganizationsOrgIdEnrollmentsGet([
			mockCompleteEnrollment,
			mockEnrollmentWithFoster,
		]),
		apiOrganizationsOrgIdReportsIdGet: (_: any) => ({
			data: mockReport,
		}),
		apiOrganizationsOrgIdReportsIdPut: (_: any) => ({ data: mockReport }),
	})
);

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
			const { getByText, getByRole } = render(
				<TestProvider>
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
			const { getByText, getByLabelText } = render(
				<TestProvider>
					<ReportDetail />
				</TestProvider>
			);

			fireEvent.change(getByLabelText(/Care 4 Kids/), { target: { value: '1234.56' } });
			fireEvent.change(getByLabelText('Family Fees'), { target: { value: '1234.56' } });
			expect(getByText('Submit').hasAttribute('disabled')).toEqual(false);
		});
	});

	accessibilityTestHelper(
		<TestProvider>
			<ReportDetail />
		</TestProvider>
	);
});
