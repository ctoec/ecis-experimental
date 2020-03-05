// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
	mockOrganization,
} from '../../../tests/data';
import mockUseApi, { mockApiOrganizationsIdGet } from '../../../hooks/__mocks__/useApi';

const submittedReport = { ...mockDefaultReport, submittedAt: new Date('2019-09-14') };
const defaultReports = [mockDefaultReport, submittedReport];

let mockReports = defaultReports;

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsIdGet: mockApiOrganizationsIdGet(mockOrganization),
		apiOrganizationsOrgIdReportsGet: (_: any) => [false, null, mockReports],
	})
);

import React from 'react';
import { render } from '@testing-library/react';
import ReportsSummary from './ReportsSummary';
import CommonContextProviderMock from '../../../contexts/__mocks__/TestProvider';
import { accessibilityTestHelper } from '../../accessibilityTestHelper';

afterAll(() => {
	jest.resetModules();
});

describe('ReportsSummary', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<CommonContextProviderMock>
				<ReportsSummary />
			</CommonContextProviderMock>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	describe('when there are no pending reports', () => {
		beforeEach(() => {
			mockReports = [submittedReport];
		});

		it('shows explanatory text', () => {
			const { getAllByText } = render(
				<CommonContextProviderMock>
					<ReportsSummary />
				</CommonContextProviderMock>
			);
			expect(getAllByText(/No reports pending/)).toHaveLength(1);
		});
	});

	accessibilityTestHelper(
		<CommonContextProviderMock>
			<ReportsSummary />
		</CommonContextProviderMock>
	);
});
