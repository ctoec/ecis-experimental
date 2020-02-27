import moment from 'moment';
import {
	CdcReport,
	Enrollment,
	FundingSource,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	ApiOrganizationsOrgIdEnrollmentsGetRequest,
} from '../../generated';
import { completeEnrollment, child, report, organization } from '../../tests/data';
import { swapFields } from '../../tests/helpers';

const enrollmentValidationError = [
	{
		message: 'Child has validation errors',
		isSubObjectValidation: true,
		field: 'Child',
	},
];

export const enrollmentMissingBirthCertId = swapFields(completeEnrollment, [
	{ keys: ['child', 'birthCertificateId'], newValue: undefined },
	{ keys: ['id'], newValue: 2 },
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

export const enrollmentWithFoster = swapFields(completeEnrollment, [
	{ keys: ['child', 'foster'], newValue: true },
	{ keys: ['id'], newValue: 6 },
	{ keys: ['child', 'family', 'determinations'], newValue: [] },
]);

export const allFakeEnrollments = [
	{
		enrollment: completeEnrollment,
	},
	{
		enrollment: enrollmentMissingBirthCertId,
	},
	{
		enrollment: enrollmentMissingAddress,
	},
	{
		enrollment: enrollmentWithLaterStart,
	},
	{
		doNotIncludeInAllEnrollments: true,
		enrollment: enrollmentWithFoster,
	},
];

export const defaultReport = swapFields(report, [
	{
		keys: ['enrollments'],
		newValue: allFakeEnrollments
			.filter(e => !e.doNotIncludeInAllEnrollments)
			.map(e => e.enrollment),
	},
]);

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

export const mockApi = {
	apiOrganizationsOrgIdEnrollmentsGet: (params: ApiOrganizationsOrgIdEnrollmentsGetRequest) => {
		const enrollments = allFakeEnrollments
			.filter(e => !e.doNotIncludeInAllEnrollments)
			.filter(e => !params.siteIds || params.siteIds.includes(e.enrollment.siteId))
			.filter(({ enrollment: e }) => {
				return (
					(!e.entry ? true : moment(e.entry).isBefore(params.endDate)) &&
					(!e.exit ? true : moment(e.exit).isAfter(moment(params.startDate)))
				);
			})
			.map(e => e.enrollment);
		return [false, null, enrollments];
	},
	apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGet: (
		params: ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest
	) => {
		const thisEnrollment = allFakeEnrollments.find(e => e.enrollment.id === params.id);
		let error = null;
		if (!thisEnrollment) return;
		const mutate = (_: any) => {
			return new Promise(resolve => {
				resolve(thisEnrollment.enrollment);
			});
		};
		return [false, error, thisEnrollment.enrollment, mutate];
	},
	apiOrganizationsOrgIdChildrenGet: (params: any) => {
		const mappedChildToEnrollment = [child].reduce<{ [x: string]: Enrollment[] }>((acc, c) => {
			acc[c.id] = c.enrollments || [];
			return acc;
		}, {});
		return [false, null, mappedChildToEnrollment];
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
	apiOrganizationsIdGet: (params: any) => [false, null, organization],
	apiOrganizationsOrgIdReportsIdGet: (params: any) => [false, null, defaultReport],
	apiOrganizationsOrgIdSitesSiteIdEnrollmentsIdDelete: (params: any) => [false, null],
};

export default (query: (api: any) => any) => {
	return query(mockApi);
};
