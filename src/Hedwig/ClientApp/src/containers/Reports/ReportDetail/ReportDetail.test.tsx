import React from 'react';
import { mount, shallow } from 'enzyme';
import 'react-dates/initialize';
import ReportDetail from './ReportDetail';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
	useParams: () => ({
		id: 1,
		orgId: 1,
	}),
}));

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
		const wrapper = mount(
			<CommonContextProviderMock>
				<ReportDetail />
			</CommonContextProviderMock>
		);
		const alert = wrapper.find('.usa-alert__heading').text();
		expect(alert).toBe('Update roster');
		wrapper.unmount();
	});
});
