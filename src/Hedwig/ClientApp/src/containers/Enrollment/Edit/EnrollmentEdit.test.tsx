import React from 'react';
import mockdate from 'mockdate';
import { createBrowserHistory } from 'history';
import { act } from 'react-dom/test-utils';
import { render, fireEvent, wait, waitForElement, getByText } from '@testing-library/react';
import 'react-dates/initialize';
import CommonContextProviderMock, {
	defaultCdcReportingPeriods,
} from '../../../contexts/__mocks__/CommonContextProviderMock';
import {
	completeEnrollment,
	enrollmentMissingFirstName,
	enrollmentMissingAddress,
} from '../../../hooks/__mocks__/useApi';
import EnrollmentEdit from './EnrollmentEdit';

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
	describe('child info', () => {
		it('shows an error if rendered without a child first name', async () => {
			const { getByText } = render(
				<CommonContextProviderMock>
					<EnrollmentEdit
						history={history}
						match={{
							params: {
								enrollmentId: enrollmentMissingFirstName.id,
								sectionId: 'child-information',
							},
						}}
					/>
				</CommonContextProviderMock>
			);

			// Save without entering any data
			fireEvent.click(getByText('Save'));

			// TODO: also try with keyboard event?

			const firstNameErr = await waitForElement(() =>
				getByText('This information is required for enrollment')
			);

			expect(firstNameErr).toBeInTheDOM();
			// TODO: the id needs to be updated-- this will probably mess things up
			expect(firstNameErr.id).toBe('child.firstname-error');
		});
	});

	// describe('family info', () => {
	// 	it('shows a fieldset warning if there is no address', async () => {
	// 		const wrapper = shallow(
	// 			<CommonContextProviderMock>
	// 				<EnrollmentEdit
	// 					history={history}
	// 					match={{
	// 						params: {
	// 							enrollmentId: enrollmentMissingAddress.id,
	// 							sectionId: 'family-information',
	// 						},
	// 					}}
	// 				/>
	// 			</CommonContextProviderMock>
	// 		);
	// 		const formContent = wrapper
	// 			.find('EnrollmentEdit')
	// 			.dive()
	// 			.find('Form')
	// 			.dive();
	// 		await act(async () => {
	// 			formContent
	// 				.find('form')
	// 				.simulate('submit', { preventDefault() {} });
	// 		});
	// 		const addressErr = formContent
	// 			.find('FieldSet#family-address')
	// 			.dive()
	// 			.find('FormStatus')
	// 			.props().type;
	// 		expect(addressErr).toBe('warning');
	// 	});
	// });

	// describe('family income', () => {
	// 	it('shows an info alert if family income is not disclosed', () => {
	// 		const wrapper = shallow(
	// 			<CommonContextProviderMock>
	// 				<EnrollmentEdit
	// 					history={history}
	// 					match={{
	// 						params: {
	// 							enrollmentId: completeEnrollment.id,
	// 							sectionId: 'family-income',
	// 						},
	// 					}}
	// 				/>
	// 			</CommonContextProviderMock>
	// 		);

	// 		const alertPropsType = wrapper
	// 			.find('EnrollmentEdit')
	// 			.dive()
	// 			.find('Form')
	// 			.dive()
	// 			.find('Alert')
	// 			.props().type;
	// 		expect(alertPropsType).toBe('info');
	// 	});
	// });

	// describe('enrollment and funding', () => {
	// 	it('shows the appropriate number of reporting periods for enrollment funding', () => {
	// 		const wrapper = mount(
	// 			<CommonContextProviderMock>
	// 				<EnrollmentEdit
	// 					history={history}
	// 					match={{
	// 						params: { enrollmentId: completeEnrollment.id, sectionId: 'enrollment-funding' },
	// 					}}
	// 				/>
	// 			</CommonContextProviderMock>
	// 		);
	// 		const reportingPeriodOptions = wrapper.find('select#firstReportingPeriod option');
	// 		expect(reportingPeriodOptions.length).toBe(defaultCdcReportingPeriods.length + 1);
	// 		wrapper.unmount();
	// 	});
	// })
});
