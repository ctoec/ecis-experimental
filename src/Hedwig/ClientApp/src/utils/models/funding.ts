import { DateRange } from '../../components';
import { Funding, FundingSource, ReportingPeriod, FundingSpace } from '../../generated';
import moment from 'moment';
import { dateSorter } from '../dateSorter';

/**
 * constant for display string when an enrollment has no funding
 */
export const NO_FUNDING = 'private pay';

/**
 * Returns time from associated fundingSpace, or undefined
 * @param funding
 */
export function getFundingTime(funding: Funding | undefined) {
	if (!funding) return;
	if (!funding.fundingSpace) return;

	return funding.fundingSpace.time;
}

/**
 * naive-ly deduplicate fundings based on source & time for displaying in roster
 * @param fundings
 */
export function dedupeFundings(fundings: Funding[]) {
	const uniqueFundings: { [key: string]: Funding } = {};

	fundings.forEach((funding) => {
		const key = `${funding.source}${getFundingTime(funding)}`;
		if (!uniqueFundings[key]) {
			uniqueFundings[key] = funding;
		}
	});

	return Object.values(uniqueFundings);
}

/**
 * Returns true if the funding overlaps with the provided range.
 * If no range is provided, defaults to {now(), now()}
 * @param funding
 * @param range
 */
export function isCurrentToRange(funding: Funding, range?: DateRange): boolean {
	range = range ? range : { startDate: moment(), endDate: moment() };
	switch (funding.source) {
		case FundingSource.CDC:
			return isCurrentToRangeCDC(funding, range);
		default:
			return false;
	}
}

/**
 * CDC Funding does NOT overlap with range if:
 * - Last reporting period ends before range starts
 * - First reporting period starts after range ends
 * @param funding
 * @param range
 */
function isCurrentToRangeCDC(funding: Funding, range: DateRange): boolean {
	if (
		(range.startDate &&
			funding.lastReportingPeriod &&
			range.startDate.isAfter(funding.lastReportingPeriod.periodEnd)) ||
		(range.endDate &&
			funding.firstReportingPeriod &&
			range.endDate.isBefore(funding.firstReportingPeriod.periodStart))
	) {
		return false;
	}
	// TODO: right now this returns true if first reporting period and last reporting period are undefined-- do we want that?
	return true;
}

/**
 * Returns the CDC funding with lastReportingPeriod = null
 * (there should only ever be one!)
 * @param fundings
 */
export function getCurrentCdcFunding(fundings: Funding[] | null): Funding | undefined {
	return (fundings || []).find(
		(funding) => funding.source === FundingSource.CDC && !funding.lastReportingPeriod
	);
}

export function createFunding({
	enrollmentId,
	source,
	fundingSpace,
	firstReportingPeriod,
}: {
	enrollmentId: number;
	source: FundingSource | null;
	fundingSpace?: FundingSpace;
	firstReportingPeriod?: ReportingPeriod;
}): Funding {
	switch (source) {
		case FundingSource.CDC:
			return {
				id: 0,
				enrollmentId,
				source,
				fundingSpaceId: fundingSpace ? fundingSpace.id : null,
				fundingSpace,
				firstReportingPeriodId: firstReportingPeriod ? firstReportingPeriod.id : undefined,
				firstReportingPeriod,
			};
		case null:
			return {
				id: 0,
				enrollmentId,
				source: undefined,
				fundingSpaceId: null,
			};
		default:
			throw new Error('Something impossible happened');
	}
}

export function updateFunding({
	currentFunding,
	source,
	fundingSpace,
	firstReportingPeriod,
}: {
	currentFunding: Funding;
	source?: FundingSource;
	fundingSpace?: FundingSpace;
	firstReportingPeriod?: ReportingPeriod;
}): Funding {
	source = source ? source : currentFunding.source;
	switch (source) {
		case FundingSource.CDC:
			return {
				...currentFunding,
				source,
				fundingSpaceId: fundingSpace ? fundingSpace.id : null,
				fundingSpace: fundingSpace,
				firstReportingPeriodId: firstReportingPeriod ? firstReportingPeriod.id : undefined,
				firstReportingPeriod: firstReportingPeriod,
			};
		default:
			throw new Error('Something impossible happened');
	}
}

/**
 * Sort function to sort an array of fundings by firstReportingPeriod.period
 * @param a
 * @param b
 */
export function fundingStartSorter(a: Funding, b: Funding): number {
	var dateA = a.firstReportingPeriod ? a.firstReportingPeriod.period : null;
	var dateB = b.firstReportingPeriod ? b.firstReportingPeriod.period : null;
	return dateSorter(dateA, dateB);
}
