// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
	mockFullTimeInfantEnrollment,
	mockPartTimeInfantEnrollment,
	mockPartTimeEnrollment,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
} from '../../../hooks/__mocks__/useApi';

let mockReport = mockDefaultReport;
let mockMutate: any;

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdEnrollmentsGet: mockApiOrganizationsOrgIdEnrollmentsGet([
			mockCompleteEnrollment,
			mockEnrollmentWithFoster,
		]),
		apiOrganizationsOrgIdReportsIdGet: (_: any) => [false, null, mockReport, mockMutate],
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
import { render, fireEvent } from '@testing-library/react';
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

	it('has the correct utilization ratios', () => {
		mockReport = {
			...mockDefaultReport,
			enrollments: [
				mockPartTimeInfantEnrollment,
				mockFullTimeInfantEnrollment,
				mockCompleteEnrollment,
				mockPartTimeEnrollment,
			],
		};
		mockMutate = jest.fn(() => Promise.resolve());
		const { getAllByText } = render(
			<TestProvider>
				<ReportDetail />
			</TestProvider>
		);
		const oneOfZeros = getAllByText('1/0 spaces');
		const oneOfTwos = getAllByText('1/2 spaces');
		// Infant toddler full and part and preschool part will all be 1/0 spaces
		expect(oneOfZeros).toHaveLength(3);
		// Preschool full will be 1/2 spaces
		expect(oneOfTwos).toHaveLength(1);
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
			mockMutate = jest.fn(() => Promise.resolve());
		});

		it('allows the report to be submitted', () => {
			const { getByText, getByLabelText } = render(
				<TestProvider>
					<ReportDetail />
				</TestProvider>
			);

			fireEvent.change(getByLabelText(/Care 4 Kids/), { target: { value: '1234.56' } });
			fireEvent.change(getByLabelText('Family Fees'), { target: { value: '1234.56' } });
			fireEvent.click(getByText('Submit'));

			expect(mockMutate).toHaveBeenCalled();
		});
	});

	accessibilityTestHelper(
		<TestProvider>
			<ReportDetail />
		</TestProvider>
	);
});
