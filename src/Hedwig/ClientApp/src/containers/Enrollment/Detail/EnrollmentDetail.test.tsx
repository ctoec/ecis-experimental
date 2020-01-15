import React from 'react';
import { mount } from 'enzyme';
import { BrowserRouter } from 'react-router-dom';
import 'react-dates/initialize';
import EnrollmentDetail from './EnrollmentDetail';
import UserContext from '../../../contexts/User/UserContext';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import {
	User,
	Region,
	ReportingPeriod,
	FundingSource,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
} from '../../../generated';
import emptyGuid from '../../../utils/emptyGuid';

const user: User = {
	id: 1,
	wingedKeysId: emptyGuid(),
	firstName: 'Minerva',
	lastName: 'McGonagall',
	orgPermissions: [
		{
			organizationId: 1,
			organization: {
				id: 1,
				name: "Children's Adventure Center",
				sites: [
					{
						id: 1,
						name: "Children's Adventure Center",
						organizationId: 1,
						region: Region.East,
						titleI: false,
					},
				],
			},
			id: 1,
			userId: 1,
		},
	],
	sitePermissions: [],
};

const fakeReportingPeriodContext: ReportingPeriod[] = [
	{
		id: 1,
		type: FundingSource.CDC,
		period: new Date('2019-03-01'),
		periodStart: new Date('2019-03-01'),
		periodEnd: new Date('2019-03-31'),
		dueAt: new Date('2019-04-15'),
	},
	{
		id: 2,
		type: FundingSource.CDC,
		period: new Date('2019-04-01'),
		periodStart: new Date('2019-04-01'),
		periodEnd: new Date('2019-04-30'),
		dueAt: new Date('2019-05-15'),
	},
	{
		id: 3,
		type: FundingSource.CDC,
		period: new Date('2019-05-01'),
		periodStart: new Date('2019-05-01'),
		periodEnd: new Date('2019-05-31'),
		dueAt: new Date('2019-06-15'),
	},
];

jest.mock('../../../hooks/useApi');
import useApi from '../../../hooks/useApi';

afterAll(() => {
	jest.resetModules();
});

// TODO: write all the enrollment tests in one file?  figure out way to separate them
const EnrollmentTestWrapper: React.FC = ({ children }) => (
	<UserContext.Provider value={{ user }}>
		<ReportingPeriodContext.Provider value={{ cdcReportingPeriods: fakeReportingPeriodContext }}>
			<BrowserRouter>{children}</BrowserRouter>
		</ReportingPeriodContext.Provider>
	</UserContext.Provider>
);

describe('EnrollmentDetail', () => {
	it('matches snapshot', () => {
		const wrapper = mount(
			<EnrollmentTestWrapper>
				<EnrollmentDetail match={{ params: { enrollmentId: 1 } }} />
			</EnrollmentTestWrapper>
		);
		expect(wrapper.html()).toMatchSnapshot();
		wrapper.unmount();
	});

	it('shows incomplete indications when incomplete information is given', () => {
		const wrapper = mount(
			<EnrollmentTestWrapper>
				<EnrollmentDetail match={{ params: { enrollmentId: 2 } }} />
			</EnrollmentTestWrapper>
		);
		const incompleteIcons = wrapper.find('.oec-inline-icon--incomplete');
		expect(incompleteIcons.length).toBe(1);
		wrapper.unmount();
	});

	// TODO: enrollment edit tests
	// it('shows the appropriate number of reporting periods', () => {
	// 	const wrapper = mount(
	// 		<EnrollmentTestWrapper>
	// 			<EnrollmentDetail match={{ params: { enrollmentId: 1 } }} />
	// 		</EnrollmentTestWrapper>
	// 	);
	// 	const reportingPeriodOptions = wrapper.find('#firstReportingPeriod option');
	// 	console.log(reportingPeriodOptions.debug());
	// 	expect(reportingPeriodOptions.length).toBe(fakeReportingPeriodContext.length);
	// 	wrapper.unmount();
	// });
});
