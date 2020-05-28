// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
	mockReportWithTimeSplitUtilizations,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
} from '../../../hooks/useApi/__mocks__/useApi';

// Jest mocks must occur before later imports
jest.mock('../../../hooks/useApi', () =>
	mockUseApi({
		apiOrganizationsOrgIdEnrollmentsGet: mockApiOrganizationsOrgIdEnrollmentsGet([
			mockCompleteEnrollment,
			mockEnrollmentWithFoster,
		]),
	})
);

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ReportSubmitForm from './ReportSubmitForm';
import TestProvider from '../../../contexts/__mocks__/TestProvider';
import { DeepNonUndefineable } from '../../../utils/types';
import { CdcReport } from '../../../generated';
import { accessibilityTestHelper } from '../../../tests/helpers';

afterAll(() => {
	jest.resetModules();
});

describe('ReportSubmitForm', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<TestProvider>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					canSubmit={true}
					error={null}
				/>
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('updates rates if accreditation is changed', () => {
		const { getAllByText, getByLabelText } = render(
			<TestProvider>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					canSubmit={true}
					error={null}
				/>
			</TestProvider>
		);

		expect(getAllByText('Preschool')[0].closest('tr')).toHaveTextContent('165.32');

		fireEvent.click(getByLabelText('Accredited'));

		expect(getAllByText('Preschool')[0].closest('tr')).toHaveTextContent('126.59');
	});

	it('pretty formats currency values', () => {
		const { getByLabelText } = render(
			<TestProvider>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					canSubmit={true}
					error={null}
				/>
			</TestProvider>
		);

		fireEvent.change(getByLabelText('Family Fees'), { target: { value: '12,34a.5' } });
		fireEvent.blur(getByLabelText('Family Fees'));

		expect(getByLabelText('Family Fees')).toHaveValue('$1,234.50');
	});

	it('shows correct number of weeks in month and weeks remaining', () => {
		const { getByLabelText } = render(
			<TestProvider>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					canSubmit={true}
					error={null}
				/>
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
				<ReportSubmitForm
					report={mockReportWithTimeSplitUtilizations as DeepNonUndefineable<CdcReport>}
					canSubmit={true}
					error={null}
				/>
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
			<ReportSubmitForm
				report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
				canSubmit={true}
				error={null}
			/>
		</TestProvider>
	);
});
