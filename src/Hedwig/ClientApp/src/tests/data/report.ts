import { CdcReport, FundingSource } from '../../generated';
import { organization } from '.';

const reportEnrollmentValidationError = [
	{
		message: 'Enrollments have validation errors',
		isSubObjectValidation: true,
		field: 'Enrollments',
	},
];

export const report: CdcReport = {
	id: 1,
	organizationId: 1,
	accredited: true,
	type: FundingSource.CDC,
	enrollments: [],
	reportingPeriod: {
		id: 1,
		type: FundingSource.CDC,
		period: new Date('2019-09-01'),
		dueAt: new Date('2019-10-15'),
		periodStart: new Date('2019-09-01'),
		periodEnd: new Date('2019-09-28'),
	},
	organization: organization,
	familyFeesRevenue: 1000,
	validationErrors: reportEnrollmentValidationError,
};
