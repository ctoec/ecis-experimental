// Variables used in jest mockes -- must start with `mock`
import {
	mockDefaultReport,
	mockReport as _mockReport,
	mockCompleteEnrollment,
	mockEnrollmentWithFoster,
} from '../../../tests/data';
import mockUseApi, {
	mockApiOrganizationsOrgIdEnrollmentsGet,
} from '../../../hooks/__mocks__/useApi';

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
import { accessibilityTestHelper } from '../../accessibilityTestHelper';

afterAll(() => {
	jest.resetModules();
});

describe('ReportSubmitForm', () => {
	it('matches snapshot', () => {
		const { asFragment } = render(
			<TestProvider>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					mutate={() => Promise.resolve()}
					canSubmit={true}
					error={null}
				/>
			</TestProvider>
		);
		expect(asFragment()).toMatchSnapshot();
	});

	it('updates rates if accreditation is changed', () => {
		const { getByText, getByLabelText } = render(
			<TestProvider>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					mutate={() => Promise.resolve()}
					canSubmit={true}
					error={null}
				/>
			</TestProvider>
		);

		expect(getByText('Preschool').closest('tr')).toHaveTextContent('$165.32');

		fireEvent.click(getByLabelText('Accredited'));

		expect(getByText('Preschool').closest('tr')).toHaveTextContent('$126.59');
	});

	it('pretty formats currency values', () => {
		const { getByLabelText } = render(
			<TestProvider>
				<ReportSubmitForm
					report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
					mutate={() => Promise.resolve()}
					canSubmit={true}
					error={null}
				/>
			</TestProvider>
		);

		fireEvent.change(getByLabelText('Family Fees'), { target: { value: '12,34a.5' } });
		fireEvent.blur(getByLabelText('Family Fees'));

		expect(getByLabelText('Family Fees')).toHaveValue('$1,234.50');
	});

	accessibilityTestHelper(
		<TestProvider>
			<ReportSubmitForm
				report={mockDefaultReport as DeepNonUndefineable<CdcReport>}
				mutate={() => Promise.resolve()}
				canSubmit={true}
				error={null}
			/>
		</TestProvider>
	);
});
