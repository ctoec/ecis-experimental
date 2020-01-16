const moment = require('moment');
import {
	FundingSource,
	ValidationProblemDetails,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
} from '../../generated';

export const completeEnrollment = {
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

export const enrollmentMissingBirthCertId = {
	id: 2,
	childId: '2',
	siteId: 1,
	ageGroup: 'Preschool',
	entry: '2019-01-01',
	exit: null,
	child: {
		id: 2,
		firstName: 'James',
		middleName: 'Sirius',
		lastName: 'Potter',
		birthdate: '2015-04-28',
		birthTown: 'Hogsmeade',
		birthState: 'CT',
		// birthCertificateId: MISSING ON PURPOSE
		nativeHawaiianOrPacificIslander: true,
		hispanicOrLatinxEthnicity: true,
		gender: 'Female',
		foster: false,
	},
	fundings: [],
};

export const enrollmentMissingFirstName = JSON.parse(JSON.stringify(completeEnrollment));
enrollmentMissingFirstName.id = 3;
enrollmentMissingFirstName.child.firstName = '';

export const allFakeEnrollments = [
	completeEnrollment,
	enrollmentMissingBirthCertId,
	enrollmentMissingFirstName,
];

export const firstNameError: ValidationProblemDetails = {
	errors: { 'Child.FirstName': ['The FirstName field is required.'] },
	type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
	title: 'One or more validation errors occurred.',
	status: 400,
};
const mutation = (_: any) => {
	return new Promise((resolve, reject) => {
		reject(firstNameError);
	});
};

export default (query: (api: any) => any) => {
	return query({
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: (
			params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
		) => {
			const thisEnrollment = allFakeEnrollments.find(e => e.id === params.id);
			const mutate = thisEnrollment.id === enrollmentMissingFirstName.id ? mutation : undefined;
			return [false, null, thisEnrollment, mutate];
		},
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
			[enrollmentMissingBirthCertId, completeEnrollment].filter(e => {
				return (
					(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
					(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
				);
			}),
		],
	});
};
