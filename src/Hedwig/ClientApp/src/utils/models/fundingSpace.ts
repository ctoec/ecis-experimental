import {
	FundingSpace,
	Age,
	Organization,
	FundingSource,
	FundingTime,
	CdcReport,
} from '../../generated';
import { prettyFundingTime } from './fundingTime';
import { isWithinFiscalYear } from '../dateFilter';
import moment from 'moment';

/**
 * Returns a prettified string for the funding time for a given fundingSpace. If the funding is type 'split',
 * then the pretty string includes both full time and part time, ordered by number of allocated weeks.
 * Optionally includes number of allocated weeks, for all times or only for split times. E.g.:
 *
 * - funding.time = Full, include weeks = false: "Full time"
 * - funding.time = Part, include weeks = true: "Part time (52 weeks)"
 *
 * - funding.time = split, funding.timeSplit = {fullTimeWeeks = 42, partTimeWeeks = 10}, include weeks = false: "Full time / part time"
 * - funding.time = split, funding.timeSplit = {fullTimeWeeks = 10, partTimeWeeks = 42}, include weeks = true: "Part time (42 weeks) / full time (10 weeks)"
 * @param fundingSpace
 */
export function prettyFundingSpaceTime(
	fundingSpace: FundingSpace | undefined,
	includeWeeks: boolean = false
) {
	if (!fundingSpace) {
		return '';
	}
	const FULL_YEAR_WEEKS = 52;
	if (fundingSpace.time !== FundingTime.Split) {
		return `${prettyFundingTime(fundingSpace.time, { capitalize: true })}${formattedWeeks(
			includeWeeks,
			FULL_YEAR_WEEKS
		)}`;
	}

	// this should not happen; fundingSpace with time === split will always have a timeSplit
	if (!fundingSpace.timeSplit) {
		throw new Error('Split time fundingSpace must have a valid timeSplit ');
	}

	const fullTimeWeeks = fundingSpace.timeSplit.fullTimeWeeks;
	const partTimeWeeks = fundingSpace.timeSplit.partTimeWeeks;
	const fullTimeFirst = fullTimeWeeks > partTimeWeeks;

	if (fullTimeFirst) {
		return (
			`${prettyFundingTime(FundingTime.Full, { capitalize: true })}${formattedWeeks(
				includeWeeks,
				fullTimeWeeks
			)}` +
			` / ${prettyFundingTime(FundingTime.Part)}${formattedWeeks(includeWeeks, partTimeWeeks)}`
		);
	}

	return (
		`${prettyFundingTime(FundingTime.Part, { capitalize: true })}${formattedWeeks(
			includeWeeks,
			partTimeWeeks
		)}` + ` / ${prettyFundingTime(FundingTime.Full)}${formattedWeeks(includeWeeks, fullTimeWeeks)}`
	);
}

function formattedWeeks(includeWeeks: boolean, weeks: number) {
	if (!includeWeeks) return '';
	if (weeks < 0) return '';
	return ` (${weeks} weeks)`;
}

/**
 * Returns the fundingSpaces with given ageGroup and source value
 *
 * @param fundingSpaces
 * @param opts
 */
export function getFundingSpaces(
	fundingSpaces: FundingSpace[] | null | undefined,
	opts: {
		ageGroup?: Age;
		source?: FundingSource;
		time?: FundingTime;
	}
) {
	if (!fundingSpaces) return [];
	const { ageGroup, source, time } = opts;
	return fundingSpaces.filter((space) => {
		let match = true;
		if (ageGroup) {
			match = match && space.ageGroup === ageGroup;
		}
		if (source) {
			match = match && space.source === source;
		}
		if (time) {
			match = match && space.time === time;
		}
		return match;
	});
}

/**
 * Returns the summed capacity for all fundingSpaces that meet the given filter criteria
 * @param organization
 * @param opts
 */
export function getFundingSpaceCapacity(
	organization: Organization | undefined,
	opts: { source?: string; ageGroup?: string }
): number {
	if (!organization) return 0;
	if (!organization.fundingSpaces) return 0;

	let fundingSpaces = organization.fundingSpaces;

	if (opts.source) {
		fundingSpaces = fundingSpaces.filter((fs) => fs.source === opts.source);
	}

	if (opts.ageGroup) {
		fundingSpaces = fundingSpaces.filter((fs) => fs.ageGroup === opts.ageGroup);
	}

	return fundingSpaces.reduce(
		(totalCapacity, fundingSpace) => totalCapacity + fundingSpace.capacity,
		0
	);
}

/**
 * Sorts fundingSpaces by age, then by time
 * @param a
 * @param b
 */
export function fundingSpaceSorter(a: FundingSpace, b: FundingSpace) {
	if (a.ageGroup > b.ageGroup) return 1;
	if (a.ageGroup < b.ageGroup) return -1;

	// secondary sort by time
	if (a.time > b.time) return 1;
	if (a.time < b.time) return -1;

	return 0;
}

export function getTimeSplitUtilizationsForFiscalYearOfReport(
	fundingSpace: FundingSpace,
	report: CdcReport
) {
	return (fundingSpace.timeSplitUtilizations || [])
		.filter((util) => util.reportId !== report.id)
		.filter((util) => util.fundingSpaceId === fundingSpace.id)
		.filter((util) =>
			isWithinFiscalYear(
				util.reportingPeriod && util.reportingPeriod.period,
				report.reportingPeriod.period
			)
		)
		.filter((util) =>
			moment(util.reportingPeriod && util.reportingPeriod.periodEnd).isBefore(
				report.reportingPeriod.periodEnd
			)
		)
		.filter((util) => util.report && !!util.report.submittedAt);
}
