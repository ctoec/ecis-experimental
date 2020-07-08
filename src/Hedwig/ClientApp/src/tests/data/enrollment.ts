import { Enrollment, Age, FundingSource } from '../../generated';
import { swapFields } from '../helpers';
import { mockChild } from './child';
import { mockSite } from './site';
import emptyGuid from '../../utils/emptyGuid';
import {
	mockFullTimePreschoolSpace,
	mockPartTimePreschoolSpace,
	mockPartTimeInfantSpace,
	mockFullTimeInfantSpace,
} from './fundingSpace';

const getValidationError = (field: string, isSubObjectValidation = false) => {
	return {
		message: `${field} has validation errors`,
		isSubObjectValidation,
		field: field,
	};
};

export const mockCompleteEnrollment: Enrollment = {
	id: 1,
	childId: emptyGuid(),
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
			firstReportingPeriodId: 1,
			firstReportingPeriod: {
				id: 1,
				type: FundingSource.CDC,
				period: new Date('2019-03-01'),
				periodStart: new Date('2019-03-01'),
				periodEnd: new Date('2019-03-31'),
				dueAt: new Date('2019-04-15'),
			},
			fundingSpaceId: mockFullTimePreschoolSpace.id,
			fundingSpace: mockFullTimePreschoolSpace,
		},
	],
};

export const mockEnrollmentMissingBirthCertId = swapFields(mockCompleteEnrollment, [
	{ keys: ['child', 'birthCertificateId'], newValue: undefined },
	{ keys: ['child', 'validationErrors'], newValue: [getValidationError('BirthCertificateId')] },
	{ keys: ['id'], newValue: 2 },
	{ keys: ['validationErrors'], newValue: [getValidationError('Child', true)] },
]);

export const mockEnrollmentMissingAddress = swapFields(mockCompleteEnrollment, [
	{ keys: ['child', 'family', 'addressLine1'], newValue: undefined },
	{ keys: ['child', 'validationErrors'], newValue: [getValidationError('Family', true)] },
	{ keys: ['child', 'family', 'validationErrors'], newValue: [getValidationError('AddressLine1')] },
	{ keys: ['id'], newValue: 4 },
	{ keys: ['validationErrors'], newValue: [getValidationError('Child', true)] },

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
	{ keys: ['id'], newValue: 5 },
	{ keys: ['entry'], newValue: new Date('2019-03-01') },
]);

export const mockEnrollmentWithFoster = swapFields(mockCompleteEnrollment, [
	{ keys: ['id'], newValue: 6 },
	{ keys: ['child', 'foster'], newValue: true },
]);

export const mockPartTimeEnrollment = swapFields(mockCompleteEnrollment, [
	{ keys: ['id'], newValue: 7 },
	{ keys: ['fundings', 0, 'fundingSpace'], newValue: mockPartTimePreschoolSpace },
	{ keys: ['fundings', 0, 'fundingSpaceId'], newValue: mockPartTimePreschoolSpace.id },
]);

export const mockPartTimeInfantEnrollment = swapFields(mockPartTimeEnrollment, [
	{ keys: ['id'], newValue: 8 },
	{ keys: ['ageGroup'], newValue: Age.InfantToddler },
	{ keys: ['fundings', 0, 'fundingSpace'], newValue: mockPartTimeInfantSpace },
	{ keys: ['fundings', 0, 'fundingSpaceId'], newValue: mockPartTimeInfantSpace.id },
]);

export const mockFullTimeInfantEnrollment = swapFields(mockCompleteEnrollment, [
	{ keys: ['id'], newValue: 9 },
	{ keys: ['ageGroup'], newValue: Age.InfantToddler },
	{ keys: ['fundings', 0, 'fundingSpace'], newValue: mockFullTimeInfantSpace },
	{ keys: ['fundings', 0, 'fundingSpaceId'], newValue: mockFullTimeInfantSpace.id },
]);

export const mockEnrollmentIncomeDeterminationNotDisclosed = swapFields(mockCompleteEnrollment, [
	{ keys: ['child', 'family', 'determinations'], newValue: [] },
]);

export const mockAllFakeEnrollments = [
	mockCompleteEnrollment, // full time preschool
	mockEnrollmentMissingBirthCertId, // full time preschool
	mockEnrollmentMissingAddress, // full time preschool
	mockEnrollmentWithLaterStart, // full time preschool
	mockEnrollmentWithFoster, // full time preschool
	mockPartTimeEnrollment, // part time preschool
	mockPartTimeInfantEnrollment,
	mockFullTimeInfantEnrollment,
	mockEnrollmentIncomeDeterminationNotDisclosed,
];
