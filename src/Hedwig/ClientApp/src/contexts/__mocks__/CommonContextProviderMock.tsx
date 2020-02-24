import React from 'react';
import { Router } from 'react-router-dom';
import 'react-dates/initialize';
import UserContext from '../User/UserContext';
import ReportingPeriodContext from '../ReportingPeriod/ReportingPeriodContext';
import { User, Region, ReportingPeriod, FundingSource } from '../../generated';
import emptyGuid from '../../utils/emptyGuid';
import { createMemoryHistory, History } from 'history';
import { RosterProvider } from '../Roster/RosterContext';

export const defaultUser: User = {
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

export const defaultCdcReportingPeriods: ReportingPeriod[] = [
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

type CommonContextProviderMockProps = {
	user?: User;
	cdcReportingPeriods?: ReportingPeriod[];
	history?: History<any>;
};

const CommonContextProviderMock: React.FC<CommonContextProviderMockProps> = ({
	children,
	user = defaultUser,
	cdcReportingPeriods = defaultCdcReportingPeriods,
	history = createMemoryHistory(),
}) => {
	return (
		<UserContext.Provider value={{ user }}>
			<ReportingPeriodContext.Provider value={{ cdcReportingPeriods }}>
				<RosterProvider>
					<Router history={history}>{children}</Router>
				</RosterProvider>
			</ReportingPeriodContext.Provider>
		</UserContext.Provider>
	);
};

export default CommonContextProviderMock;
