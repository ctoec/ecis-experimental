import React from 'react';
import mockdate from 'mockdate';
import { createBrowserHistory } from 'history';
import { render, getAllByRole } from '@testing-library/react';
import CommonContextProviderMock, {
	defaultCdcReportingPeriods,
} from '../../../contexts/__mocks__/CommonContextProviderMock';
import { enrollmentMissingAddress } from '../../../hooks/__mocks__/useApi';
import EnrollmentEdit from './EnrollmentEdit';
import { accessibilityTestHelper } from '../../accessibilityTestHelper';
import { completeEnrollment } from '../../../tests/data';

const fakeDate = '2019-03-02';

jest.mock('../../../hooks/useApi');

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

const history = createBrowserHistory();

describe('EnrollmentEdit', () => {
	describe('family info', () => {
		it('shows a fieldset warning if there is no address', () => {
			const { getByRole } = render(
				<CommonContextProviderMock>
					<EnrollmentEdit
						history={history}
						match={{
							params: {
								enrollmentId: enrollmentMissingAddress.id,
								sectionId: 'family-information',
							},
						}}
					/>
				</CommonContextProviderMock>
			);

			const addressErr = getByRole('status');

			expect(addressErr.classList.contains('usa-warning-message'));
		});
	});

	describe('family income', () => {
		it('shows an info alert if family income is not disclosed', () => {
			const { getByText } = render(
				<CommonContextProviderMock>
					<EnrollmentEdit
						history={history}
						match={{
							params: {
								enrollmentId: completeEnrollment.id,
								sectionId: 'family-income',
							},
						}}
					/>
				</CommonContextProviderMock>
			);

			const infoAlert = getByText(
				'Income information is required to enroll a child in a CDC funded space. You will not be able to assign this child to a funding space without this information.'
			);

			expect(infoAlert).toBeInTheDocument();
		});
	});

	describe('enrollment and funding', () => {
		it('shows the appropriate number of reporting periods for enrollment funding', () => {
			const { getByLabelText } = render(
				<CommonContextProviderMock>
					<EnrollmentEdit
						history={history}
						match={{
							params: { enrollmentId: completeEnrollment.id, sectionId: 'enrollment-funding' },
						}}
					/>
				</CommonContextProviderMock>
			);
			const reportingPeriodSelect = getByLabelText('First reporting period');
			const reportingPeriodOptions = getAllByRole(reportingPeriodSelect, 'option');
			expect(reportingPeriodOptions.length).toBe(defaultCdcReportingPeriods.length + 1);
		});
	});

	accessibilityTestHelper(
		<CommonContextProviderMock>
			<EnrollmentEdit
				history={history}
				match={{
					params: { enrollmentId: completeEnrollment.id, sectionId: 'enrollment-funding' },
				}}
			/>
		</CommonContextProviderMock>
	);
});
