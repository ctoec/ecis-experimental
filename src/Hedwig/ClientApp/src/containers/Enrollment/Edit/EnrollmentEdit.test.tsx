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
import { Link } from 'react-router-dom';

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
			const addressErr = formContent
				.find('FieldSet#family-address')
				.dive()
				.find('FormStatus')
				.props().type;
			expect(addressErr).toBe('warning');
			wrapper.unmount();
		});
	});

	describe('family income', () => {
		it('shows an info alert if family income is not disclosed', () => {
			const wrapper = shallow(
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

			const alertPropsType = wrapper
				.find('EnrollmentEdit')
				.dive()
				.find('Form')
				.dive()
				.find('Alert')
				.props().type;
			expect(alertPropsType).toBe('info');
			wrapper.unmount();
		});
	});

	describe('enrollment and funding', () => {
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

		it('maintains selected funding type and reporting period after clicking save and returning', async () => {
			const wrapper = mount(
				<CommonContextProviderMock>
					<EnrollmentEdit
						history={history}
						match={{
							params: { enrollmentId: completeEnrollment.id, sectionId: 'enrollment-funding' }
						}}
					/>
				</CommonContextProviderMock>
			);

			const initialFundingTypeSelect = wrapper.find('select#fundingType');
			const initialFundingType = initialFundingTypeSelect.props();
			expect(initialFundingType.value).toBe('Full');

			const saveBtn = wrapper.find('.EnrollmentFundingForm button');
			await act(async () => {
				saveBtn
					.props()
					.onClick();
			});

			console.log(wrapper.find('.oec-enrollment-details-section a'));
			const editBtn = wrapper.find('.oec-enrollment-details-section Link');
			console.log(editBtn.instance());
			await act(async () => {
				editBtn.simulate('click', { button: 0 })
			});

			const nextFundingTypeSelect = wrapper.find('select#fundingType');
			const nextFundingType = nextFundingTypeSelect.props();

			expect(nextFundingType.value).toBe(initialFundingType.value);
		})
	})
});
