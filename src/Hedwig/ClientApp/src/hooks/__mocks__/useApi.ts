const moment = require('moment');
import {
	FundingSource,
	ApiOrganizationsOrgIdSitesSiteIdEnrollmentsIdGetRequest,
	Enrollment,
	Age,
	Gender,
	FundingTime,
} from '../../generated';

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

type ChangeField = { accessor: string[]; newValue?: any };
function makeEnrollment(enrollment: Enrollment, changeFields: ChangeField[]) {
	const newEnrollment = JSON.parse(JSON.stringify(enrollment));
	changeFields.forEach(field => {
		let changeObject = newEnrollment;
		field.accessor.forEach((accessor, i) => {
			if (i === field.accessor.length - 1) {
				changeObject[accessor] = field.newValue;
			} else {
				changeObject = changeObject[accessor];
			}
		});
	});
	return newEnrollment;
}

export const enrollmentMissingBirthCertId = makeEnrollment(completeEnrollment, [
	{ accessor: ['child', 'birthCertificateId'], newValue: undefined },
	{ accessor: ['id'], newValue: 2 },
]);

export const enrollmentMissingFirstName = makeEnrollment(completeEnrollment, [
	{ accessor: ['child', 'firstName'], newValue: undefined },
	{ accessor: ['id'], newValue: 3 },
]);

export const enrollmentMissingAddress = makeEnrollment(completeEnrollment, [
	{ accessor: ['child', 'family', 'addressLine1'], newValue: undefined },
	{ accessor: ['id'], newValue: 4 },
	{
		accessor: ['child', 'family', 'validationErrors'],
		newValue: [
			{
				message: 'Street address is required',
				isSubObjectValidation: false,
				field: 'AddressLine1',
			},
		],
	},
]);

export const enrollmentWithLaterStart = makeEnrollment(completeEnrollment, [
	{ accessor: ['entry'], newValue: new Date('2019-03-01') },
	{ accessor: ['id'], newValue: 5 },
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

export default (query: (api: any) => any) => {
	return query({
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
	});
};
