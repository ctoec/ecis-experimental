import { ReportingPeriod, FundingSource } from '../../generated';
import moment from 'moment';
import {
	reportingPeriodFormatter,
	currentReportingPeriod,
	periodSorter,
	firstEligibleReportingPeriod,
	lastEligibleReportingPeriod,
} from './reportingPeriod';

// a default reporting period in the past
const baseReportingPeriod: ReportingPeriod = {
	id: 1,
	type: FundingSource.CDC,
	period: moment().add(-1, 'month').toDate(),
	periodStart: moment().add(-1, 'month').toDate(),
	periodEnd: moment().add(-1, 'month').toDate(),
	dueAt: moment().add(-1, 'month').toDate(),
};

describe('reportingPeriodFormatter', () => {
	const period = {
		...baseReportingPeriod,
		period: new Date('2020-01-01'),
		periodStart: new Date('2019-12-30'),
		periodEnd: new Date('2020-02-02'),
	};

	it('formats just the month', () => {
		expect(reportingPeriodFormatter(period)).toEqual('January 2020');
	});

	it('extended format displays the date range', () => {
		expect(reportingPeriodFormatter(period, { extended: true })).toEqual(
			'January 2020 (12/30–2/2)'
		);
	});
});

it('currentReportingPeriod finds current reporting period', () => {
	const currentId = 100;
	const startOfMonthDate = new Date(`${moment().format('YYYY-MM')}-01`);
	const reportingPeriods = [
		baseReportingPeriod,
		{
			...baseReportingPeriod,
			id: currentId,
			period: startOfMonthDate,
		},
	];

	const res = currentReportingPeriod(reportingPeriods);

	expect(res).toBeTruthy();
	expect(res).toHaveProperty('id', currentId);
});

it.each([true, false])('periodSorter sorts reporting periods by period start date', inverse => {
	const sooner = {
		...baseReportingPeriod,
		id: 1,
		periodStart: new Date('2019-01-01'),
	};
	const later = {
		...baseReportingPeriod,
		id: 2,
		periodStart: new Date('2019-02-01'),
	};

	const res = periodSorter(sooner, later, inverse);

	expect(true).toEqual(inverse ? res > 0 : res < 0);
});

it('firstEligibleReportingPeriod determines first eligible period for date', () => {
	const startDate = new Date('2019-01-01');
	const firstId = 100;

	const beforeEndDate = moment(startDate).add(-3, 'months');
	const before = {
		...baseReportingPeriod,
		id: firstId - 1,
		periodStart: beforeEndDate.add(-30, 'days').toDate(),
		periodEnd: beforeEndDate.toDate(),
	};

	const first = {
		...baseReportingPeriod,
		id: firstId,
		periodStart: moment(startDate)
			.add(-30, 'days')
			.toDate(),
		periodEnd: startDate,
	};

	const afterEndDate = moment(startDate).add(3, 'months');
	const after = {
		...baseReportingPeriod,
		id: firstId + 1,
		periodStart: afterEndDate.toDate(),
		periodEnd: afterEndDate.toDate(),
	};

	const periods = [after, before, first];

	const res = firstEligibleReportingPeriod(periods, startDate);

	expect(res).toHaveProperty('id', firstId);
});

it('lastEligibleReportingPeriod determines last eligible period for date', () => {
	const endDate = new Date('2019-01-01');
	const lastId = 100;

	const beforeStartDate = moment(endDate).add(-3, 'months');
	const before = {
		...baseReportingPeriod,
		id: lastId - 1,
		periodStart: beforeStartDate.toDate(),
		periodEnd: beforeStartDate.add(30, 'days').toDate(),
	};

	const last = {
		...baseReportingPeriod,
		id: lastId,
		periodStart: endDate,
		periodEnd: moment(endDate)
			.add(30, 'days')
			.toDate(),
	};

	const afterStartDate = moment(endDate).add(3, 'months');
	const after = {
		...baseReportingPeriod,
		id: lastId + 1,
		periodStart: afterStartDate.toDate(),
		periodEnd: afterStartDate.add(30, 'days').toDate(),
	};

	const periods = [after, before, last];

	const res = lastEligibleReportingPeriod(periods, endDate);

	expect(res).toHaveProperty('id', lastId);
});
