import React from 'react';
import { mount } from 'enzyme';
import 'react-dates/initialize';
import EnrollmentDetail from './EnrollmentDetail';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';


jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

afterAll(() => {
	jest.resetModules();
});

describe('EnrollmentDetail', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				<EnrollmentDetail match={{ params: { enrollmentId: 1 } }} />
			</CommonContextProviderMock>
		);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});

	it('shows incomplete indications when incomplete information is given', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				<EnrollmentDetail match={{ params: { enrollmentId: 2 } }} />
			</CommonContextProviderMock>
		);
		const incompleteIcons = wrapper.find('.oec-inline-icon--incomplete');
		expect(incompleteIcons.length).toBe(1);
		wrapper.unmount();
	});
});
