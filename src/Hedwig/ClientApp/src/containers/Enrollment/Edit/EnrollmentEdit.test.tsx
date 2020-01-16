import React from 'react';
import { mount, shallow } from 'enzyme';
import mockdate from 'mockdate';
import { createBrowserHistory } from 'history';
import { act } from 'react-dom/test-utils';
import 'react-dates/initialize';
import EnrollmentEdit from './EnrollmentEdit';
import CommonContextProviderMock, {
	defaultCdcReportingPeriods,
} from '../../../contexts/__mocks__/CommonContextProviderMock';
import {
	completeEnrollment,
	enrollmentMissingFirstName,
	enrollmentMissingAddress,
} from '../../../hooks/__mocks__/useApi';

const fakeDate = '2019-03-02';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

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
			const wrapper = shallow(
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
			const formContent = wrapper
				.find('EnrollmentEdit')
				.dive()
				.find('Form')
				.dive();
			await act(async () => {
				formContent
					.find('Button')
					.props()
					.onClick();
			});
			console.log(formContent.debug())
			const firstNameErr = formContent
				.find('TextInput#firstName')
				.dive()
				.find('FormStatus')
				.props().message;
			// All of this finding and diving is ridiculous but mount wasn't drilling down to the FormStatus for some reason
			expect(firstNameErr).toBe('This information is required for enrollment');
			wrapper.unmount();
		});
	});

	describe('family info', () => {
		it('shows a fieldset warning if there is no address', async () => {
			const wrapper = shallow(
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
			const formContent = wrapper
				.find('EnrollmentEdit')
				.dive()
				.find('Form')
				.dive();
			await act(async () => {
				formContent
					.find('Button')
					.props()
					.onClick();
			});
			const firstNameErr = formContent
				.find('TextInput#firstName')
				.dive()
				.find('FormStatus')
				.props().message;
			// All of this finding and diving is ridiculous but mount wasn't drilling down to the FormStatus for some reason
			expect(firstNameErr).toBe('This information is required for enrollment');
			wrapper.unmount();
		});
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
					match={{
						params: { enrollmentId: completeEnrollment.id, sectionId: 'enrollment-funding' },
					}}
				/>
			</CommonContextProviderMock>
		);
		const reportingPeriodOptions = wrapper.find('select#firstReportingPeriod option');
		expect(reportingPeriodOptions.length).toBe(defaultCdcReportingPeriods.length + 1);
		wrapper.unmount();
	});
});
