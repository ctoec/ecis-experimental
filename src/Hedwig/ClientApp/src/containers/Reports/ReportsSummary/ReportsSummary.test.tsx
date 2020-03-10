// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockSingleSiteOrganization,
	cdcReportingPeriods,
} from '../../../tests/data';
import mockUseApi, { mockApiOrganizationsIdGet } from '../../../hooks/__mocks__/useApi';

const submittedReport = { ...mockDefaultReport, submittedAt: new Date('2019-09-14') };
const defaultReports = [mockDefaultReport, submittedReport];
const pendingReports = cdcReportingPeriods.map(reportingPeriod => ({
	...mockDefaultReport,
	reportingPeriod,
}));

let mockReports = defaultReports;

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsIdGet: mockApiOrganizationsIdGet(mockSingleSiteOrganization),
		apiOrganizationsOrgIdReportsGet: (_: any) => [false, null, mockReports],
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
		mockReports = [submittedReport];
		const { getByText } = render(
			<CommonContextProviderMock>
				<ReportsSummary />
			</CommonContextProviderMock>
		);
		expect(
			getByText(moment(submittedReport.reportingPeriod?.period).format('MMMM YYYY'))
		).toBeInTheDocument();
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

		it('orders by due date and lists the oldest one first by default', () => {
			const { getAllByRole } = render(
				<CommonContextProviderMock>
					<ReportsSummary />
				</CommonContextProviderMock>
			);
			const textToMoment = (text: string) => moment(text, 'MMMM YYYY');
			const reportLinks = getAllByRole('link').map(link => link.textContent);
			const sortedReportLinks = [...reportLinks].sort((a, b) =>
				textToMoment(a || '').diff(textToMoment(b || ''))
			);
			expect(reportLinks).toHaveLength(pendingReports.length);
			expect(reportLinks.join()).toEqual(sortedReportLinks.join());
		});
	});

	xdescribe('when there are submitted reports', () => {
		it('lists the one with the most recent reporting period first by default', () => {});
	});

	xdescribe('when there are submitted and pending reports', () => {
		it('does not include submitted reports in the pending table', () => {});
		it('does not include pending reports in the submitted table', () => {});
	});

	accessibilityTestHelper(
		<CommonContextProviderMock>
			<ReportsSummary />
		</CommonContextProviderMock>
	);
});
