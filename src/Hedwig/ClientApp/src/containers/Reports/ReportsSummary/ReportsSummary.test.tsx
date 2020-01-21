import React from 'react';
import { mount } from 'enzyme';
import 'react-dates/initialize';
import ReportsSummary from './ReportsSummary';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

afterAll(() => {
	jest.resetModules();
});

describe('ReportsSummary', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				<ReportsSummary />
			</CommonContextProviderMock>
		);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});
});
