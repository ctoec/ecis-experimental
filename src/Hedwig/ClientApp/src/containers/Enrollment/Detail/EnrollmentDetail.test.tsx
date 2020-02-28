import React from 'react';
import { render } from '@testing-library/react';
import EnrollmentDetail from './EnrollmentDetail';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';
import { enrollmentMissingBirthCertId } from '../../../hooks/__mocks__/useApi';
import { completeEnrollment } from '../../../tests/data';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';
import { accessibilityTestHelper } from '../../accessibilityTestHelper';

afterAll(() => {
	jest.resetModules();
});

describe('EnrollmentDetail', () => {
	it('matches snapshot', () => {
		const { container } = render(
			<CommonContextProviderMock>
				<EnrollmentDetail match={{ params: { enrollmentId: completeEnrollment.id } }} />
			</CommonContextProviderMock>
		);
		expect(container).toMatchSnapshot();
	});

	it('shows incomplete indications when incomplete information is given', () => {
		const { getAllByText } = render(
			<CommonContextProviderMock>
				<EnrollmentDetail match={{ params: { enrollmentId: enrollmentMissingBirthCertId.id } }} />
			</CommonContextProviderMock>
		);

		const incompleteIcons = getAllByText('(incomplete)');
		expect(incompleteIcons.length).toBe(1);
	});

	accessibilityTestHelper(
		<CommonContextProviderMock>
			<EnrollmentDetail match={{ params: { enrollmentId: enrollmentMissingBirthCertId.id } }} />
		</CommonContextProviderMock>
	);
});
