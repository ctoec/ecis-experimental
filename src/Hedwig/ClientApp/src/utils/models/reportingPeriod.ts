import { ReportingPeriod } from '../../generated';
import moment from 'moment';
import { propertyDateSorter } from '../dateSorter';

/**
 * Returns the formatted month string for the reporting period
 * @param period
 */
export function getReportingPeriodMonth(period: ReportingPeriod) {
	return moment(period.period).format('MMMM');
}

/**
 * Returns the number of weeks (inclusive of start and end date) in the reporting period
 * @param period
 */
export function getReportingPeriodWeeks(period: ReportingPeriod) {
	return moment(period.periodEnd).add(1, 'day').diff(moment(period.periodStart), 'weeks');
}

/**
 * Formats reporting period, in normal or extended format:
 * E.g.
 * reporting period -> { period: '2020-02-01', periodStart: '2019-02-03', periodEnd: '2019-03-01'}
 * formatted (normal) -> "February 2020" (from period.period)
 * formatted (extended) -> "February 2020 (02/03 - 03/01)"
 * @param period
 * @param options
 */
export const reportingPeriodFormatter = (
	period: ReportingPeriod | undefined,
	options: { extended?: boolean } = {}
) => {
	if (!period) {
		return '';
	}

	const extended = options.extended || false;

	let periodString = moment(period.period).format('MMMM YYYY');

	if (extended) {
		const start = moment(period.periodStart).format('M/D');
		const end = moment(period.periodEnd).format('M/D');
		periodString += ` (${start}–${end})`;
	}

	return periodString;
};

/**
 * Returns the current reporting period, defined as the period for which
 * period month and year equal current month and year
 * @param periods
 */
export const currentReportingPeriod = (periods: ReportingPeriod[]): ReportingPeriod | undefined => {
	return periods.find(
		(period) => moment(period.period).format('YYYY-MM') === moment().format('YYYY-MM')
	);
};

/**
 * Function to determine the first eligible reporting period for a given enrollment start date (entry)
 * @param periods The array of reporting periods provided by ReportingPeriodContext
 * @param startDate The enrollment start date (entry)
 */
export const firstEligibleReportingPeriod = (
	periods: ReportingPeriod[],
	startDate: Date
): ReportingPeriod | undefined => {
	const filteredPeriods = [...periods].filter((period) =>
		moment(startDate).isSameOrBefore(period.periodEnd)
	);
	const sortedPeriods = [...filteredPeriods].sort((a, b) =>
		propertyDateSorter(a, b, (r) => r.periodStart)
	);
	return sortedPeriods[0];
};

/**
 * Function to determine the last eligible reporting period for a given enrollment end date.
 * @param periods The array of reporting periods provided by ReportingPeriodContext
 * @param endDate The enrollment start date (exit)
 */
export const lastEligibleReportingPeriod = (
	periods: ReportingPeriod[],
	endDate: Date
): ReportingPeriod | undefined => {
	const filteredPeriods = [...periods].filter((period) =>
		moment(period.periodStart).isSameOrBefore(endDate)
	);
	const sortedPeriods = [...filteredPeriods].sort((a, b) =>
		propertyDateSorter(a, b, (r) => r.periodStart, true)
	);
	return sortedPeriods[0];
};

export const lastNReportingPeriods = (
	periods: ReportingPeriod[],
	endDate: Date,
	n: number
): ReportingPeriod[] => {
	const sortedPeriods = [...periods].sort((a, b) =>
		propertyDateSorter(a, b, (r) => r.period, true)
	);

	const _lastEligibleReportingPeriod = lastEligibleReportingPeriod(periods, endDate);
	if (!_lastEligibleReportingPeriod) {
		return [];
	}

	const index = sortedPeriods.findIndex((period) => period.id === _lastEligibleReportingPeriod.id);
	return sortedPeriods.slice(index, index + n);
};
