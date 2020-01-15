import {
	User,
	Region,
	ReportingPeriod,
	FundingSource,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
} from '../../generated';

// https://github.com/facebook/jest/issues/5579
// jest.mock('useApi', () => {
const moment = require('moment');

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

const incompleteEnrollment = Object.assign({}, completeEnrollment, {
	entry: undefined,
});

export default (callback: any, dependencies: any[]) => {
	return callback(
		{
			apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: (
				params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
			) => [false, null, params.id === 1 ? completeEnrollment : incompleteEnrollment],
			apiOrganizationsOrgIdSitesIdGet: (params: any) => [
				false,
				null,
				{
					id: 1,
					name: "Children's Adventure Center",
					organizationId: 1,
					enrollments: undefined,
					organization: undefined,
				},
			],
			apiOrganizationsOrgIdSitesSiteIdEnrollmentsGet: (params: any) => [
				false,
				null,
				[
					{
						child: {
							id: 1,
							firstName: 'James',
							middleName: 'Sirius',
							lastName: 'Potter',
							birthdate: '2015-04-28',
							suffix: null,
						},
						entry: '2019-01-01',
						exit: null,
						fundings: [],
						id: 1,
						ageGroup: 'preschool',
						siteId: 1,
					},
					{
						child: {
							id: 2,
							firstName: 'Lily',
							middleName: 'Luna',
							lastName: 'Potter',
							birthdate: '2016-12-12',
							suffix: null,
						},
						entry: '2019-03-03',
						exit: null,
						fundings: [
							{
								entry: '2019-03-01',
								exit: '2019-04-01',
								source: 'CDC',
								time: 'part',
							},
						],
						id: 2,
						ageGroup: 'preschool',
					},
				].filter(e => {
					return (
						(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
						(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
					);
				}),
			],
		},
		[]
	);
};
