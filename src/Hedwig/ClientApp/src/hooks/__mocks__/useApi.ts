const moment = require('moment');
import {
	FundingSource,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
} from '../../generated';


const completeEnrollment = {
	id: 1,
	childId: '2',
	siteId: 1,
	ageGroup: 'Preschool',
	entry: '2019-02-03',
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
		nativeHawaiianOrPacificIslander: true,
		hispanicOrLatinxEthnicity: true,
		gender: 'Female',
		foster: false,
	},
	fundings: [
		{
			id: 1,
			enrollmentId: 1,
			source: FundingSource.CDC,
			familyId: 1,
			certificateStartDate: new Date('2019-03-01'),
			firstReportingPeriodId: 1,
			firstReportingPeriod: {
				id: 1,
				type: FundingSource.CDC,
				period: new Date('2019-03-01'),
				periodStart: new Date('2019-03-01'),
				periodEnd: new Date('2019-03-31'),
				dueAt: new Date('2019-04-15'),
			},
			time: 'Full',
		},
	],
};

const incompleteEnrollment = Object.assign({}, completeEnrollment, {
	entry: undefined,
});

export default (query: (api: any) => any) => {
	return query({
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
							source: FundingSource.CDC,
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
	});
};
