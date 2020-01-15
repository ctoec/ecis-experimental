import React from 'react';
import { mount } from 'enzyme';
import mockdate from 'mockdate';
import { BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import 'react-dates/initialize';
import EnrollmentEdit from './EnrollmentEdit';
import UserContext from '../../../contexts/User/UserContext';
import ReportingPeriodContext from '../../../contexts/ReportingPeriod/ReportingPeriodContext';
import { User, Region, ReportingPeriod, FundingSource } from '../../../generated';
import emptyGuid from '../../../utils/emptyGuid';

const fakeDate = '2019-03-02';

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

beforeAll(() => {
	mockdate.set(fakeDate);
});

afterAll(() => {
	mockdate.reset();
	jest.resetModules();
});

const EnrollmentTestWrapper: React.FC = ({ children }) => (
	<UserContext.Provider value={{ user }}>
		<ReportingPeriodContext.Provider value={{ cdcReportingPeriods: fakeReportingPeriodContext }}>
			<BrowserRouter>{children}</BrowserRouter>
		</ReportingPeriodContext.Provider>
	</UserContext.Provider>
);

const history = createBrowserHistory();

describe('EnrollmentEdit', () => {
	it('shows the appropriate number of reporting periods', () => {
		const wrapper = mount(
			<EnrollmentTestWrapper>
				<EnrollmentEdit
					history={history}
					match={{ params: { enrollmentId: 1, sectionId: 'enrollment-funding' } }}
				/>
			</EnrollmentTestWrapper>
		);
		const reportingPeriodOptions = wrapper.find('select#firstReportingPeriod option');
		expect(reportingPeriodOptions.length).toBe(fakeReportingPeriodContext.length + 1);
		wrapper.unmount();
	});
});
