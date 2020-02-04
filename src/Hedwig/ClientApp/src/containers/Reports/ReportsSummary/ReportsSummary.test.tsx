import React from 'react';
import { render } from '@testing-library/react'
import ReportsSummary from './ReportsSummary';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';
import useApi from '../../../hooks/useApi';
import { CdcReport } from '../../../generated';
import { mockApi, defaultReport } from '../../../hooks/__mocks__/useApi';

const submittedReport = { ...defaultReport, submittedAt: new Date('2019-09-14') };

let mockLoading: boolean;
let mockError: string | null;
let mockReports: CdcReport[];

const defaultLoading = false;
const defaultError   = null;
const defaultReports = [defaultReport, submittedReport];

beforeEach(() => {
	mockLoading = defaultLoading;
	mockError   = defaultError;
	mockReports = defaultReports;
});

jest.mock('../../../hooks/useApi', () => (query: Function) => query({
	...mockApi,
	apiOrganizationsOrgIdReportsGet: (params: any) => [
		mockLoading,
		mockError,
		mockReports
	]
}));

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
		})
	})
});
