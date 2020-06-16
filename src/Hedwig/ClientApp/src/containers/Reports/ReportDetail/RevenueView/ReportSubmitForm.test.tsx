// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
	mockReportWithTimeSplitUtilizations,
} from '../../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
} from '../../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdEnrollmentsGet: mockApiOrganizationsOrgIdEnrollmentsGet([
			mockCompleteEnrollment,
			mockEnrollmentWithFoster,
		]),
	})
);

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ReportSubmitForm from '.';
import TestProvider from '../../../../contexts/__mocks__/TestProvider';
import { DeepNonUndefineable } from '../../../../utils/types';
import { CdcReport } from '../../../../generated';
import { accessibilityTestHelper } from '../../../../tests/helpers';
import { Form } from '../../../../components/Form_New';
import { createMemoryHistory } from 'history';
import ReportDetail from '../ReportDetail';

afterAll(() => {
	jest.resetModules();
});

describe('ReportSubmitForm', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<TestProvider>
				<Form<CdcReport>
					data={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					onSubmit={jest.fn()}
					className=""
				>
					<ReportSubmitForm
						report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
						canSubmit={true}
						error={null}
						errorAlertState={undefined}
						attemptingSave={false}
					/>
				</Form>
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('pretty formats currency values', () => {
		const { getByLabelText } = render(
			<TestProvider>
				<Form<CdcReport>
					data={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					onSubmit={jest.fn()}
					className=""
				>
					<ReportSubmitForm
						report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
						canSubmit={true}
						error={null}
						errorAlertState={undefined}
						attemptingSave={false}
					/>
				</Form>
			</TestProvider>
		);

		fireEvent.change(getByLabelText('Family Fees'), { target: { value: '12,34a.5' } });
		fireEvent.blur(getByLabelText('Family Fees'));

		expect(getByLabelText('Family Fees')).toHaveValue('$1,234.50');
	});

	it('shows correct number of weeks in month and weeks remaining', () => {
		const { getByLabelText } = render(
			<TestProvider>
				<Form<CdcReport>
					data={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					onSubmit={jest.fn()}
					className=""
				>
					<ReportSubmitForm
						report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
						canSubmit={true}
						error={null}
						errorAlertState={undefined}
						attemptingSave={false}
					/>
				</Form>
			</TestProvider>
		);

		const weeksInputField = getByLabelText(/services were provided/i);
		const weeksString = weeksInputField.nextElementSibling;
		if (!weeksString || !weeksString.textContent) {
			throw new Error('Cannot find next sibling of weeks input');
		}
		expect(weeksString.textContent).toMatch(/of 4 weeks/i);
		expect(weeksString.textContent).toMatch(/10 .* weeks remaining/i);
	});

	it('shows correct number of weeks in month and weeks remaining when previous weeks were used', () => {
		const { getByLabelText } = render(
			<TestProvider>
				<Form<CdcReport>
					data={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					onSubmit={jest.fn()}
					className=""
				>
					<ReportSubmitForm
						report={mockReportWithTimeSplitUtilizations as DeepNonUndefineable<CdcReport>}
						canSubmit={true}
						error={null}
						errorAlertState={undefined}
						attemptingSave={false}
					/>
				</Form>
			</TestProvider>
		);

		const weeksInputField = getByLabelText(/services were provided/i);
		const weeksString = weeksInputField.nextElementSibling;
		if (!weeksString || !weeksString.textContent) {
			throw new Error('Cannot find next sibling of weeks input');
		}
		expect(weeksString.textContent).toMatch(/of 4 weeks/i);
		expect(weeksString.textContent).toMatch(/5 .* weeks remaining/i);
	});

	accessibilityTestHelper(
		<TestProvider>
			<Form<CdcReport>
				data={mockDefaultReport as DeepNonUndefineable<CdcReport>}
				onSubmit={jest.fn()}
				className=""
			>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					canSubmit={true}
					error={null}
					errorAlertState={undefined}
					attemptingSave={false}
				/>
			</Form>
		</TestProvider>
	);
});
