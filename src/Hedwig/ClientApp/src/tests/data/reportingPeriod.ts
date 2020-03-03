import { ReportingPeriod, FundingSource } from '../../generated';

export const cdcReportingPeriods: ReportingPeriod[] = [
	{
		id: 1,
		type: FundingSource.CDC,
		period: new Date('2019-03-01'),
		periodStart: new Date('2019-03-01'),
		periodEnd: new Date('2019-03-31'),
		dueAt: new Date('2019-04-15'),
	},
	{
		id: 2,
		type: FundingSource.CDC,
		period: new Date('2019-04-01'),
		periodStart: new Date('2019-04-01'),
		periodEnd: new Date('2019-04-30'),
		dueAt: new Date('2019-05-15'),
	},
	{
		id: 3,
		type: FundingSource.CDC,
		period: new Date('2019-05-01'),
		periodStart: new Date('2019-05-01'),
		periodEnd: new Date('2019-05-31'),
		dueAt: new Date('2019-06-15'),
	},
];
