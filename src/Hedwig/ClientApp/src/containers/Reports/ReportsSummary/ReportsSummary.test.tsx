// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockSingleSiteOrganization,
	cdcReportingPeriods,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsIdGet,
	mockApiOrganizationsOrgIdReportsGet,
} from '../../../hooks/__mocks__/newUseApi';

const pendingReports = cdcReportingPeriods.map(reportingPeriod => ({
	...mockDefaultReport,
	reportingPeriod,
}));
const submittedReports = pendingReports.map(pendingReport => ({
	...pendingReport,
	submittedAt: new Date('2019-09-14'),
}));
const defaultReports = [...pendingReports, ...submittedReports];

let mockReports = defaultReports;

const reportingPeriodToMoment = (text: string) => moment(text, 'MMMM YYYY');

// Jest mocks must occur before later imports
jest.mock('../../../hooks/newUseApi', () =>
	mockUseApi({
		apiOrganizationsIdGet: mockApiOrganizationsIdGet(mockSingleSiteOrganization),
		apiOrganizationsOrgIdReportsGet: (_: any) =>
			mockApiOrganizationsOrgIdReportsGet(mockReports)(_),
	})
);

import React from 'react';
import { render } from '@testing-library/react';
import ReportsSummary from './ReportsSummary';
import CommonContextProviderMock from '../../../contexts/__mocks__/TestProvider';
import { accessibilityTestHelper } from '../../../tests/helpers';
import moment from 'moment';

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

	it('formats reporting period as MMMM YYYY', () => {
		mockReports = submittedReports;
		const { getByText } = render(
			<CommonContextProviderMock>
				<ReportsSummary />
			</CommonContextProviderMock>
		);
		expect(
			getByText(moment(submittedReports[0].reportingPeriod?.period).format('MMMM YYYY'))
		).toBeInTheDocument();
	});

	describe('when there are pending reports', () => {
		beforeEach(() => {
			mockReports = pendingReports;
		});

		it('lists the correct number of reports', () => {
			const { getAllByText } = render(
				<CommonContextProviderMock>
					<ReportsSummary />
				</CommonContextProviderMock>
			);
			expect(getAllByText(/CDC/)).toHaveLength(pendingReports.length);
		});

		it('orders by due date and lists the oldest report first by default', () => {
			const { getAllByRole } = render(
				<CommonContextProviderMock>
					<ReportsSummary />
				</CommonContextProviderMock>
			);
			// Get the report links as they appear in the document
			const reportLinks = getAllByRole('link').map(link => link.textContent);
			// Copy the array and sort it by ascending date for comparison
			const sortedReportLinks = [...reportLinks].sort((a, b) =>
				reportingPeriodToMoment(a || '').diff(reportingPeriodToMoment(b || ''))
			);
			// Make sure we're not comparing empty arrays
			expect(reportLinks).toHaveLength(pendingReports.length);
			// The joined strings of link text should be the same because the order of dates should be the same
			expect(reportLinks.join()).toEqual(sortedReportLinks.join());
		});
	});

	describe('when there are submitted reports', () => {
		beforeEach(() => {
			mockReports = submittedReports;
		});

		it('shows explanatory text', () => {
			const { getAllByText } = render(
				<CommonContextProviderMock>
					<ReportsSummary />
				</CommonContextProviderMock>
			);
			expect(getAllByText(/No reports pending/)).toHaveLength(1);
		});

		it('lists the correct number of reports', () => {
			const { getAllByText } = render(
				<CommonContextProviderMock>
					<ReportsSummary />
				</CommonContextProviderMock>
			);
			expect(getAllByText(/CDC/)).toHaveLength(submittedReports.length);
		});

		it('lists the reports with the most recent reporting period first by default', () => {
			// Opposite of the pending reports test
			const { getAllByRole } = render(
				<CommonContextProviderMock>
					<ReportsSummary />
				</CommonContextProviderMock>
			);
			// Get the report links as they appear in the document
			const reportLinks = getAllByRole('link').map(link => link.textContent);
			// Copy the array and sort it by ascending date for comparison

			const sortedReportLinks = [...reportLinks].sort((a, b) =>
				reportingPeriodToMoment(b || '').diff(reportingPeriodToMoment(a || ''))
			);
			// Make sure we're not comparing empty strings
			expect(reportLinks).toHaveLength(pendingReports.length);
			// The joined strings of link text should be the same because the order of dates should be the same
			expect(reportLinks.join()).toEqual(sortedReportLinks.join());
		});
	});

	accessibilityTestHelper(
		<CommonContextProviderMock>
			<ReportsSummary />
		</CommonContextProviderMock>
	);
});
