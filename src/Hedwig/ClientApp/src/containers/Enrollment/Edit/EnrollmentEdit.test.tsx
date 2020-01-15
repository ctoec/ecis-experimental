import React from 'react';
import { mount } from 'enzyme';
import mockdate from 'mockdate';
import { createBrowserHistory } from 'history';
import 'react-dates/initialize';
import EnrollmentEdit from './EnrollmentEdit';
import CommonContextProviderMock, { defaultCdcReportingPeriods } from '../../../contexts/__mocks__/CommonContextProviderMock';

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
	it('shows the appropriate number of reporting periods', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				<EnrollmentEdit
					history={history}
					match={{ params: { enrollmentId: 1, sectionId: 'enrollment-funding' } }}
				/>
			</CommonContextProviderMock>
		);
		const reportingPeriodOptions = wrapper.find('select#firstReportingPeriod option');
		expect(reportingPeriodOptions.length).toBe(defaultCdcReportingPeriods.length + 1);
		wrapper.unmount();
	});
});
