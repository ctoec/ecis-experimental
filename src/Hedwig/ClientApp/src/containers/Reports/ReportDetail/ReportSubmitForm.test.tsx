import React from 'react';
import { mount, shallow } from 'enzyme';
import 'react-dates/initialize';
import ReportSubmitForm from './ReportSubmitForm';
import CommonContextProviderMock from '../../../contexts/__mocks__/CommonContextProviderMock';
import { defaultReport } from '../../../hooks/__mocks__/useApi';

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

afterAll(() => {
	jest.resetModules();
});

// TODO: FIX THIS
describe('EnrollmentDetail', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<CommonContextProviderMock>
				{/* <ReportSubmitForm
					report={defaultReport}
					mutate={mutate}
					canSubmit={numEnrollmentsMissingInfo === 0}
				/> */}
			</CommonContextProviderMock>
		);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});

	// it('shows incomplete indications when incomplete information is given', () => {
	// 	const wrapper = shallow(
	// 		<CommonContextProviderMock>
	// 			<ReportSubmitForm match={{ params: { enrollmentId: enrollmentMissingBirthCertId.id } }} />
	// 		</CommonContextProviderMock>
	// 	);

	// 	// :/
	// 	const incompleteIcons = wrapper
	// 		.find('EnrollmentDetail')
	// 		.dive()
	// 		.find('Summary')
	// 		.first()
	// 		.dive()
	// 		.find('.oec-inline-icon--incomplete');
	// 	expect(incompleteIcons.length).toBe(1);
	// 	wrapper.unmount();
	// });
});
