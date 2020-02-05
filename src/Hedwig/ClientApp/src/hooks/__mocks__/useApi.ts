const moment = require('moment');
import {
	Age,
	CdcReport,
	Enrollment,
	FundingSource,
	FundingTime,
	Gender,
	Region,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
} from '../../generated';

type ChangeField = { keys: string[]; newValue?: any };
const swapFields = <T>(inputObject: T, changeFields: ChangeField[]): T => {
	// Make a deep copy to avoid changing the original
	const newObject = JSON.parse(JSON.stringify(inputObject));
	changeFields.forEach(field => {
		let changeObject = newObject;
		field.keys.forEach((key, i) => {
			// Accessors are an ordered array of strings referring to nested keys
			if (i === field.keys.length - 1) {
				// If it's the last key in the array, then it's the thing that needs to be changed to a new value
				changeObject[key] = field.newValue;
			} else {
				// Otherwise keep digging
				changeObject = changeObject[key];
			}
		});
	});
	return newObject;
};

const reportEnrollmentValidationError = [
	{
		message: 'Enrollments have validation errors',
		isSubObjectValidation: true,
		field: 'Enrollments',
	},
];

const enrollmentValidationError = [
	{
		message: 'Child has validation errors',
		isSubObjectValidation: true,
		field: 'Child',
	},
];

export const completeEnrollment: Enrollment = {
	id: 1,
	childId: '2',
	siteId: 1,
	ageGroup: Age.Preschool,
	entry: new Date('2018-02-03'),
	exit: null,
	child: {
		id: '2',
		firstName: 'Lily',
		middleName: 'Luna',
		lastName: 'Potter',
		birthdate: new Date('2016-12-12'),
		birthTown: 'Hogsmeade',
		birthState: 'CT',
		birthCertificateId: '123',
		nativeHawaiianOrPacificIslander: true,
		hispanicOrLatinxEthnicity: true,
		gender: Gender.Female,
		foster: false,
		familyId: 1,
		organizationId: 1,
		family: {
			id: 1,
			addressLine1: '4 Privet Drive',
			town: 'Hogsmeade',
			state: 'CT',
			zip: '77777',
			homelessness: false,
			organizationId: 1,
			determinations: [{ id: 1, notDisclosed: true, familyId: 1 }],
		},
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
			time: FundingTime.Full,
		},
	],
};

export const enrollmentMissingBirthCertId = swapFields(completeEnrollment, [
	{ keys: ['child', 'birthCertificateId'], newValue: undefined },
	{ keys: ['id'], newValue: 2 },
	{ keys: ['validationErrors'], newValue: enrollmentValidationError },
]);

export const enrollmentMissingFirstName = swapFields(completeEnrollment, [
	{ keys: ['child', 'firstName'], newValue: undefined },
	{ keys: ['id'], newValue: 3 },
	{ keys: ['validationErrors'], newValue: enrollmentValidationError },
]);

export const enrollmentMissingAddress = swapFields(completeEnrollment, [
	{ keys: ['child', 'family', 'addressLine1'], newValue: undefined },
	{ keys: ['id'], newValue: 4 },
	{ keys: ['validationErrors'], newValue: enrollmentValidationError },

	{
		keys: ['child', 'family', 'validationErrors'],
		newValue: [
			{
				message: 'Street address is required',
				isSubObjectValidation: false,
				field: 'AddressLine1',
			},
		],
	},
]);

export const enrollmentWithLaterStart = swapFields(completeEnrollment, [
	{ keys: ['entry'], newValue: new Date('2019-03-01') },
	{ keys: ['id'], newValue: 5 },
]);

export const allFakeEnrollments = [
	{
		enrollment: completeEnrollment,
	},
	{
		enrollment: enrollmentMissingBirthCertId,
	},
	{
		enrollment: enrollmentMissingFirstName,
		mutationError: {
			errors: { 'Child.FirstName': ['The FirstName field is required.'] },
			type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
			title: 'One or more validation errors occurred.',
			status: 400,
		},
	},
	{
		enrollment: enrollmentMissingAddress,
	},
	{
		enrollment: enrollmentWithLaterStart,
	},
];

export const defaultOrganization = {
	id: 1,
	name: 'Test Organization',
	fundingSpaces: [
		{
			source: FundingSource.CDC,
			ageGroup: Age.Preschool,
			time: FundingTime.Full,
			capacity: 2,
			organizationId: 1,
		},
	],
	sites: [
		{
			name: 'Test Site',
			region: Region.East,
			titleI: false,
			organizationId: 1,
		},
	],
};

export const defaultReport: CdcReport = {
	id: 1,
	organizationId: 1,
	accredited: true,
	type: FundingSource.CDC,
	enrollments: allFakeEnrollments.map(e => e.enrollment),
	reportingPeriod: {
		id: 1,
		type: FundingSource.CDC,
		period: new Date('2019-09-01'),
		dueAt: new Date('2019-10-15'),
		periodStart: new Date('2019-09-01'),
		periodEnd: new Date('2019-09-28'),
	},
	organization: defaultOrganization,
	familyFeesRevenue: 1000,
	validationErrors: reportEnrollmentValidationError,
};

export const laterReport: CdcReport = swapFields(defaultReport, [
	{
		keys: ['reportingPeriod'],
		newValue: {
			id: 1,
			type: FundingSource.CDC,
			period: new Date('2019-10-01'),
			dueAt: new Date('2019-11-15'),
			periodStart: new Date('2019-10-01'),
			periodEnd: new Date('2019-10-31'),
		},
	},
	{ keys: ['id'], newValue: 2 },
]);

export const earlierReport: CdcReport = swapFields(defaultReport, [
	{
		keys: ['reportingPeriod'],
		newValue: {
			id: 1,
			type: FundingSource.CDC,
			period: new Date('2019-08-01'),
			dueAt: new Date('2019-09-15'),
			periodStart: new Date('2019-08-01'),
			periodEnd: new Date('2019-08-31'),
		},
	},
	{ keys: ['id'], newValue: 3 },
	{ keys: ['submittedAt'], newValue: new Date('2019-09-14') },
	{ keys: ['validationErrors'], newValue: undefined },
]);

export default (query: (api: any) => any) => {
	return query({
		apiOrganizationsOrgIdEnrollmentsGet: (
			params: ApiOrganizationsOrgIdEnrollmentsGetRequest
		) => {
			const enrollments = allFakeEnrollments
				.filter(e => (params.siteIds || []).includes(e.enrollment.siteId))
				.filter(({ enrollment: e }) => {
					return (
						(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
						(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
					);
				});
			return [false, null, enrollments];
		},
		apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: (
			params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
		) => {
			const thisEnrollment = allFakeEnrollments.find(e => e.enrollment.id === params.id);
			if (!thisEnrollment) return;
			const mutate = (_: any) => {
				return new Promise((resolve, reject) => {
					thisEnrollment.mutationError
						? reject(thisEnrollment.mutationError)
						: resolve(thisEnrollment.enrollment);
				});
			};
			return [false, null, thisEnrollment.enrollment, mutate];
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
			[enrollmentWithLaterStart, completeEnrollment].filter(e => {
				return (
					(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
					(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
				);
			}),
		],
		apiOrganizationsOrgIdReportsGet: (params: any) => [
			false,
			null,
			[defaultReport, laterReport, earlierReport],
			(_: any) => {
				return new Promise((resolve, reject) => {
					resolve(defaultReport);
					reject({});
				});
			},
		],
		apiOrganizationsIdGet: (params: any) => [false, null, defaultOrganization],
		apiOrganizationsOrgIdReportsIdGet: (params: any) => [false, null, defaultReport],
	});
};
