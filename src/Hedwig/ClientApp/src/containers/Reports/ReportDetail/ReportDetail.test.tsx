import React from 'react';
import { mount, shallow } from 'enzyme';
import 'react-dates/initialize';
import ReportDetail from './ReportDetail';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

afterAll(() => {
	jest.resetModules();
});

describe('ReportDetail', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				<ReportDetail />
			</CommonContextProviderMock>
		);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});

	it('shows an alert if enrollments are missing info', () => {
		const wrapper = shallow(
			<CommonContextProviderMock>
				<ReportDetail match={{ params: {} }}/>
			</CommonContextProviderMock>
		);
		const incompleteIcons = wrapper
			.find('ReportDetail')
			.dive();
		console.log(incompleteIcons.debug())
		// expect(incompleteIcons.length).toBe(1);
		wrapper.unmount();
	});
});
