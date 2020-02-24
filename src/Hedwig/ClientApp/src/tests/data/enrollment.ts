import { Enrollment, Age, FundingSource, FundingTime } from '../../generated';

import { child } from '.';

export const completeEnrollment: Enrollment = {
	id: 1,
	childId: '2',
	siteId: 1,
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
	child: child,
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
