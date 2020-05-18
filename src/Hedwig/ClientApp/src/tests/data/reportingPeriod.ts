import { ReportingPeriod, FundingSource } from '../../generated';

const defaultCdcReportingPeriod = { type: FundingSource.CDC };

const marchFirst = new Date('2019-03-01');
const marchReportingPeriod = {
	...defaultCdcReportingPeriod,
	id: 1,
	period: marchFirst,
	periodStart: marchFirst,
	periodEnd: new Date('2019-03-31'),
	dueAt: new Date('2019-04-15'),
};

const aprilFirst = new Date('2019-04-01');
const aprilReportingPeriod = {
	...defaultCdcReportingPeriod,
	id: 2,
	period: aprilFirst,
	periodStart: aprilFirst,
	periodEnd: new Date('2019-04-30'),
	dueAt: new Date('2019-05-15'),
};

const mayFirst = new Date('2019-05-01');
const mayReportingPeriod = {
	...defaultCdcReportingPeriod,
	id: 3,
	period: mayFirst,
	periodStart: mayFirst,
	periodEnd: new Date('2019-05-31'),
	dueAt: new Date('2019-06-15'),
};

const augustFirst = new Date('2019-08-01');
export const augustReportingPeriod = {
	...defaultCdcReportingPeriod,
	id: 4,
	period: augustFirst,
	periodStart: augustFirst,
	periodEnd: new Date('2019-08-31'),
	dueAt: new Date('2019-09-15'),
};

export const cdcReportingPeriods: ReportingPeriod[] = [
	marchReportingPeriod,
	aprilReportingPeriod,
	mayReportingPeriod,
];
