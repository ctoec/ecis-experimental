import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import 'react-dates/initialize';
import ReportDetail from './ReportDetail';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';
import useApi from '../../../hooks/useApi';
import { CdcReport } from '../../../generated';
import { mockApi, defaultReport, completeEnrollment } from '../../../hooks/__mocks__/useApi';

const readyReport = { ...defaultReport, enrollments: [completeEnrollment] };

jest.mock('../../../hooks/useApi');

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: 1,
		orgId: 1,
	}),
}));

let mockLoading: boolean;
let mockError: string | null;
let mockReport: CdcReport;
let mockMutate: Function;

const defaultLoading = false;
const defaultError   = null;
const defaultMutate  = () => Promise.resolve();

beforeEach(() => {
	mockLoading = defaultLoading;
	mockError   = defaultError;
	mockReport  = defaultReport;
	mockMutate  = defaultMutate;
});

jest.mock('../../../hooks/useApi', () => (query: Function) => query({
	...mockApi,
	apiOrganizationsOrgIdReportsIdGet: (params: any) => [
		mockLoading,
		mockError,
		mockReport,
		mockMutate
	]
}));

afterAll(() => {
	jest.resetModules();
});

describe('ReportDetail', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<CommonContextProviderMock>
				<ReportDetail />
			</CommonContextProviderMock>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	describe('when roster is missing information', () => {
		it('shows an alert and disables submit', () => {
			const { getByText, getByRole } = render(
				<CommonContextProviderMock>
					<ReportDetail />
				</CommonContextProviderMock>
			);

			expect(getByRole('alert')).toHaveTextContent('Update roster');
			expect(getByText('Submit')).toHaveAttribute('disabled');
		});
	});

	describe('when report is ready to be submitted', () => {
		beforeEach(() => {
			mockReport = readyReport;
			mockMutate = jest.fn(() => Promise.resolve());
		});

		it('allows the report to be submitted', () => {
			const { getByText, getByLabelText } = render(
				<CommonContextProviderMock>
					<ReportDetail />
				</CommonContextProviderMock>
			);

			fireEvent.change(getByLabelText(/Care 4 Kids/), { target: { value: '1234.56' } });
			fireEvent.change(getByLabelText('Family Fees'), { target: { value: '1234.56' } });
			fireEvent.click(getByText('Submit'));

			expect(mockMutate).toHaveBeenCalled();
		});
	});
});
