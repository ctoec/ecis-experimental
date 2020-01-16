import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import mockdate from 'mockdate';
import { createBrowserHistory } from 'history';
import 'react-dates/initialize';
import EnrollmentEdit from './EnrollmentEdit';
import CommonContextProviderMock, {
	defaultCdcReportingPeriods,
} from '../../../contexts/__mocks__/CommonContextProviderMock';
import {
	completeEnrollment,
	enrollmentMissingBirthCertId,
	enrollmentMissingFirstName,
} from '../../../hooks/__mocks__/useApi';

const fakeDate = '2019-03-02';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';
import { act } from 'react-dom/test-utils';

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

const history = createBrowserHistory();

export async function waitForComponentToPaint<P = {}>(wrapper: ReactWrapper<P>, amount = 1000) {
	await act(async () => {
		await new Promise(resolve => setTimeout(resolve, amount));
		wrapper.update();
	});
}

describe('EnrollmentEdit', () => {
	// Add tests for validations for each section
	describe('child info', () => {
		it('shows an error if rendered without a child first name', async () => {
			const wrapper = mount(
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
			const saveButton = wrapper.find('Button')
			await act(async () => {
				saveButton.simulate('click')
			})
			waitForComponentToPaint(wrapper);
			const firstNameErr = wrapper.find('#firstName');
			console.log(firstNameErr.debug())
			expect(true);
			wrapper.unmount();
		})
	});

	describe('family info', () => {
		// const wrapper = mount(
		// 	<CommonContextProviderMock>
		// 		<EnrollmentEdit
		// 			history={history}
		// 			match={{ params: { enrollmentId: completeEnrollment.id, sectionId: 'family-information' } }}
		// 		/>
		// 	</CommonContextProviderMock>
		// );
		// const reportingPeriodOptions = wrapper.find('select#firstReportingPeriod option');
		// expect(reportingPeriodOptions.length).toBe(defaultCdcReportingPeriods.length + 1);
		// wrapper.unmount();
	});

	describe('family income', () => {
		// const wrapper = mount(
		// 	<CommonContextProviderMock>
		// 		<EnrollmentEdit
		// 			history={history}
		// 			match={{ params: { enrollmentId: completeEnrollment.id, sectionId: 'family-income' } }}
		// 		/>
		// 	</CommonContextProviderMock>
		// );
		// const reportingPeriodOptions = wrapper.find('select#firstReportingPeriod option');
		// expect(reportingPeriodOptions.length).toBe(defaultCdcReportingPeriods.length + 1);
		// wrapper.unmount();
	});

	it('shows the appropriate number of reporting periods for enrollment funding', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				<EnrollmentEdit
					history={history}
					match={{ params: { enrollmentId: completeEnrollment.id, sectionId: 'enrollment-funding' } }}
				/>
			</CommonContextProviderMock>
		);
		const reportingPeriodOptions = wrapper.find('select#firstReportingPeriod option');
		expect(reportingPeriodOptions.length).toBe(defaultCdcReportingPeriods.length + 1);
		wrapper.unmount();
	});
});
