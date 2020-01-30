import React from 'react';
import { mount } from 'enzyme';
import 'react-dates/initialize';
import ReportSubmitForm from './ReportSubmitForm';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';
import { defaultReport } from '../../../hooks/__mocks__/useApi';
import { DeepNonUndefineable } from '../../../utils/types';
import { CdcReport } from '../../../generated';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

afterAll(() => {
	jest.resetModules();
});

describe('EnrollmentDetail', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				<ReportSubmitForm
					report={defaultReport as DeepNonUndefineable<CdcReport>}
					mutate={(_: any) => {
						return new Promise((resolve, reject) => {
							resolve(defaultReport);
							reject({});
						});
					}}
					canSubmit={true}
				/>
			</CommonContextProviderMock>
		);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});
});
