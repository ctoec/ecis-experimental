import { Enrollment, Age, FundingSource, FundingTime } from '../../generated';
import { swapFields } from '../helpers';
import { mockChild } from '.';
import { mockSite } from './site';

const enrollmentValidationError = [
	{
		message: 'Child has validation errors',
		isSubObjectValidation: true,
		field: 'Child',
	},
];

export const mockCompleteEnrollment: Enrollment = {
	id: 1,
	childId: '2',
	siteId: 1,
	site: mockSite,
	ageGroup: Age.Preschool,
	entry: new Date('2018-02-03'),
	exit: null,
	author: {
		firstName: 'Test',
		lastName: 'User',
		id: 1,
		wingedKeysId: '00000000-0000-0000-0000-000000000000',
	},
	updatedAt: new Date('2020-01-01'),
	child: mockChild,
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

export const mockEnrollmentMissingBirthCertId = swapFields(mockCompleteEnrollment, [
	{ keys: ['child', 'birthCertificateId'], newValue: undefined },
	{ keys: ['id'], newValue: 2 },
	{ keys: ['validationErrors'], newValue: enrollmentValidationError },
]);

export const mockEnrollmentMissingAddress = swapFields(mockCompleteEnrollment, [
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

export const mockEnrollmentWithLaterStart = swapFields(mockCompleteEnrollment, [
	{ keys: ['entry'], newValue: new Date('2019-03-01') },
	{ keys: ['id'], newValue: 5 },
]);

export const mockEnrollmentWithFoster = swapFields(mockCompleteEnrollment, [
	{ keys: ['child', 'foster'], newValue: true },
	{ keys: ['id'], newValue: 6 },
	{ keys: ['child', 'family', 'determinations'], newValue: [] },
]);

export const mockAllFakeEnrollments = [
	mockCompleteEnrollment,
	mockEnrollmentMissingBirthCertId,
	mockEnrollmentMissingAddress,
	mockEnrollmentWithLaterStart,
	mockEnrollmentWithFoster,
];
