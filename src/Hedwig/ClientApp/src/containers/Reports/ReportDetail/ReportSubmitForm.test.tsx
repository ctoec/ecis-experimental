import React from 'react';
import { mount, shallow } from 'enzyme';
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

	// See TODO in report submit form-- currently no api errors, are those fields actually required?
	// it('shows an error when information is missing', () => {
	// 	const wrapper = mount(
	// 		<CommonContextProviderMock>
	// 			<ReportSubmitForm
	// 				report={defaultReport as DeepNonUndefineable<CdcReport>}
	// 				mutate={(_: any) => {
	// 					return new Promise((resolve, reject) => {
	// 						resolve(defaultReport);
	// 						reject({});
	// 					});
	// 				}}
	// 				canSubmit={false}
	// 			/>
	// 		</CommonContextProviderMock>
	// 	);

	// 	const incompleteIcons = wrapper
	// 		.find('.oec-inline-icon--incomplete');
	// 	expect(incompleteIcons.length).toBe(2);
	// 	wrapper.unmount();
	// });
});
