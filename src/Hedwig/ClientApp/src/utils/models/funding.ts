import { DeepNonUndefineable } from '../types';
import { DateRange } from '../../components';
import { Funding, FundingSource, FundingTime, ReportingPeriod, Enrollment } from '../../generated';
import moment from 'moment';

/**
 * naive-ly deduplicate fundings based on source & time for displaying in roster
 * @param fundings
 */
export function dedupeFundings(fundings: Funding[]) {
	const uniqueFundings: { [key: string]: Funding } = {};

	fundings.forEach(funding => {
		const key = `${funding.source}${funding.time}`;
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
export function isCurrentFundingToRange(funding: Funding, range?: DateRange): boolean {
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

export function currentCdcFunding(
	fundings: DeepNonUndefineable<Funding[]> | null
): DeepNonUndefineable<Funding> | undefined {
	return (fundings || []).find<DeepNonUndefineable<Funding>>(
		funding => funding.source === FundingSource.CDC && !funding.lastReportingPeriod
	);
}

export function createFunding({
	enrollmentId,
	source,
	time,
	firstReportingPeriod,
	familyId,
	certificateStartDate,
}: {
	enrollmentId: number;
	source: FundingSource | null;
	time?: FundingTime;
	firstReportingPeriod?: ReportingPeriod;
	familyId?: number | null;
	certificateStartDate?: Date;
}): Funding {
	switch (source) {
		case FundingSource.CDC:
			return {
				id: 0,
				enrollmentId,
				source,
				time,
				firstReportingPeriodId: firstReportingPeriod ? firstReportingPeriod.id : null,
				firstReportingPeriod,
			};
		case null:
			return {
				id: 0,
				enrollmentId,
				source: undefined,
			};
		default:
			throw new Error('Something impossible happened');
	}
}

export function updateFunding({
	currentFunding,
	source,
	time,
	reportingPeriod,
	familyId,
	certificateStartDate,
}: {
	currentFunding: Funding;
	source?: FundingSource;
	time?: FundingTime;
	reportingPeriod?: ReportingPeriod;
	familyId?: number | null;
	certificateStartDate?: Date;
}): Funding {
	source = source ? source : currentFunding.source;
	switch (source) {
		case FundingSource.CDC:
			return {
				...currentFunding,
				source,
				time,
				firstReportingPeriodId: reportingPeriod ? reportingPeriod.id : undefined,
				firstReportingPeriod: reportingPeriod,
			};
		default:
			throw new Error('Something impossible happened');
	}
}

export function getFundings(
	enrollment: DeepNonUndefineable<Enrollment>
): DeepNonUndefineable<Funding[]> | undefined {
	const fundings = enrollment.fundings;
	return !fundings ? undefined : fundings;
}

export function getSourcelessFunding(
	enrollment: DeepNonUndefineable<Enrollment>
): DeepNonUndefineable<Funding> | undefined {
	const fundings = getFundings(enrollment);
	if (!fundings) {
		return undefined;
	}

	return fundings.find(funding => !funding.source);
}

export const NO_FUNDING = 'private pay';
