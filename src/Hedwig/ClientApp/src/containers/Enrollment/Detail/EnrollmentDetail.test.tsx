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
		dueAt: new Date('2019-04-01'),
	},
];

// https://github.com/facebook/jest/issues/5579
jest.mock('../../../hooks/useApi', () => {
	const completeEnrollment = {
		id: 1,
		childId: '2',
		siteId: 1,
		ageGroup: 'preschool',
		entry: '2019-03-03',
		exit: null,
		child: {
			id: 2,
			firstName: 'Lily',
			middleName: 'Luna',
			lastName: 'Potter',
			birthdate: '2016-12-12',
			birthTown: 'Hogsmeade',
			birthState: 'CT',
			birthCertificateId: '123',
			suffix: null,
			gender: 'Female',
			hispanicOrLatinxEthnicity: true,
			nativeHawaiianOrPacificIslander: true,
		},
		fundings: [
			{
				firstReportingPeriodId: 1,
				entry: '2019-03-01',
				exit: '2019-04-01',
				source: 'CDC',
				time: 'part',
			},
		],
	};

	const incompleteEnrollment = Object.assign({}, completeEnrollment, { entry: undefined });

	return {
		__esModule: true,
		default: (callback: any, dependencies: any[]) => {
			return callback(
				{
					apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: (
						params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
					) => [false, null, params.id === 1 ? completeEnrollment : incompleteEnrollment],
				},
				[]
			);
		},
	};
});

import useApi from '../../../hooks/useApi';

// beforeAll(() => {
// 	// mockdate.set(fakeDate);
// });

afterAll(() => {
	jest.resetModules();
});

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
});
