import { CdcReport, FundingSource } from '../../generated';
import { mockAllFakeEnrollments } from './enrollment';
import { swapFields } from '../helpers';
import {
	mockSingleSiteOrganization,
	mockSingleSiteOrganizationWithTimeSplitUtilizations,
} from './organization';

const reportEnrollmentValidationError = [
	{
		message: 'Enrollments have validation errors',
		isSubObjectValidation: true,
		field: 'Enrollments',
	},
];

export const mockReport: CdcReport = {
	id: 1,
	organizationId: 1,
	accredited: true,
	type: FundingSource.CDC,
	enrollments: [],
	reportingPeriodId: 1,
	reportingPeriod: {
		id: 1,
		type: FundingSource.CDC,
		period: new Date('2019-09-01'),
		dueAt: new Date('2019-10-15'),
		periodStart: new Date('2019-09-01'),
		periodEnd: new Date('2019-09-28'),
	},
	organization: mockSingleSiteOrganization,
	familyFeesRevenue: 1000,
	validationErrors: reportEnrollmentValidationError,
};

export const mockDefaultReport = swapFields(mockReport, [
	{
		keys: ['enrollments'],
		newValue: mockAllFakeEnrollments,
	},
]);

export const laterReport: CdcReport = swapFields(mockDefaultReport, [
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

export const earlierReport: CdcReport = swapFields(mockDefaultReport, [
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

export const mockReportWithTimeSplitUtilizations = swapFields(mockDefaultReport, [
	{
		keys: ['organization'],
		newValue: mockSingleSiteOrganizationWithTimeSplitUtilizations,
	},
]);
