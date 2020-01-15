import { ReportingPeriod, Funding } from '../../generated';
import idx from 'idx';
import moment from 'moment';

export const currentReportingPeriod = (periods: ReportingPeriod[]): ReportingPeriod | undefined => {
	const now = moment();
	const startOfMonthDate = moment(`${now.format('YYYY-MM')}-01`);
	// Assumes that ReportingPeriod.Period will always be on the first day of the month
	return periods.find(period => period.period.getTime() === startOfMonthDate.valueOf());
};

/**
 * Sorts reporting periods by period start date.
 * @param a Reporting Period
 * @param b Reporting Period
 */
export const periodSorter = (a: ReportingPeriod, b: ReportingPeriod) => {
	if (a.periodStart === b.periodStart) return 0;
	if (a.periodStart < b.periodStart) return -1;
	return 1;
};

const periodSorterInverse = (a: ReportingPeriod, b: ReportingPeriod) => {
	if (a.periodStart === b.periodStart) return 0;
	if (a.periodStart > b.periodStart) return -1;
	return 1;
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
	const filteredPeriods = [...periods].filter(period =>
		moment(startDate).isSameOrBefore(period.periodEnd)
	);
	const sortedPeriods = [...filteredPeriods].sort(periodSorter);
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
	const filteredPeriods = [...periods].filter(period => endDate >= period.periodStart);
	const sortedPeriods = [...filteredPeriods].sort(periodSorterInverse);
	return sortedPeriods[0];
};

/**
 * Function to determine whether the given funding is compatible with the given reporting period.
 * @param funding Funding to check whether it is compatible with the given reporting period.
 * @param period Reporting period to check whether the given funding is compatible.
 */
export const fundingWithinReportingPeriod = (
	funding: Funding,
	period: ReportingPeriod
): boolean => {
	const fundingPeriodStart = idx(funding, _ => _.firstReportingPeriod.periodStart);
	const fundingPeriodEnd = idx(funding, _ => _.lastReportingPeriod.periodEnd);
	const start = period.periodStart;
	const end = period.periodEnd;

	if (!fundingPeriodStart && !fundingPeriodEnd) {
		return false;
	} else if (!fundingPeriodEnd) {
		return (fundingPeriodStart as Date) < end;
	} else {
		return start < fundingPeriodEnd;
	}
};

/**
 * Function to return array of first N reporting periods sorted by date such that all are eligible reporting periods for the given start date.
 * @param periods The array of reporting periods provided by ReportingPeriodContext
 * @param startDate The enrollment start date (aka entry)
 * @param n The number of reporting periods to return
 */
export const nextNReportingPeriods = (
	periods: ReportingPeriod[],
	startDate: Date,
	n: number
): ReportingPeriod[] => {
	const sortedPeriods = [...periods].sort(periodSorter);

	const _firstEligibleReportingPeriod = firstEligibleReportingPeriod(periods, startDate);
	if (!_firstEligibleReportingPeriod) {
		return [];
	}
	const index = sortedPeriods.findIndex(period => period.id === _firstEligibleReportingPeriod.id);
	return sortedPeriods.slice(index, index + n);
};

export const lastNReportingPeriods = (
	periods: ReportingPeriod[],
	endDate: Date,
	n: number
): ReportingPeriod[] => {
	const sortedPeriods = [...periods].sort(periodSorterInverse);

	const _lastEligibleReportingPeriod = lastEligibleReportingPeriod(periods, endDate);
	if (!_lastEligibleReportingPeriod) {
		return [];
	}

	const index = sortedPeriods.findIndex(period => period.id === _lastEligibleReportingPeriod.id);
	return sortedPeriods.slice(index, index + n);
};
