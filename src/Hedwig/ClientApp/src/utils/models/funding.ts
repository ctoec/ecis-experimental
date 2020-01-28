import { DeepNonUndefineable } from "../types"
import { Funding, FundingSource, FundingTime, ReportingPeriod, Enrollment} from "../../generated"
import { Tag, DateRange } from "../../components";
import getColorForFundingSource, { fundingSourceDetails } from "../fundingTypeFormatters"
import moment from "moment";

/**
 * Filter fundings for displaying 
 * @param fundings 
 * @param rosterDateRange 
 */
export function filterFundingsForRosterTags(fundings: Funding[] | null, rosterDateRange?: DateRange) {
	if (!fundings) return [];
	const currentToRosterDateRange = fundings.filter(funding => isCurrentToRange(funding, rosterDateRange));
	return dedupeFundings(currentToRosterDateRange);
}

/**
 * naive-ly deduplicate fundings based on source & time for displaying in roster
 * @param fundings
 */
function dedupeFundings(fundings: Funding[]) {
	const uniqueFundings: {[key: string]: Funding }  = {};

	fundings.forEach(funding => {
		const key = `${funding.source}${funding.time}`;
		if(!uniqueFundings[key]) {
			uniqueFundings[key] = funding;
		}
	});

	return Object.values(uniqueFundings);
}

export function generateFundingTag(funding: DeepNonUndefineable<Funding>, index?: any): JSX.Element {
	let key = `${funding.source}-${funding.time}`;
	if(index) key = `${key}-${index}`;
	const text = funding.source ? fundingSourceDetails[funding.source].tagFormatter(funding) : 'Not specified';
	const color = funding.source ? getColorForFundingSource(funding.source) : 'gray-90';
	return Tag({ key, text, color });
}

/**
 * Returns true if the funding overlaps with the provided range.
 * If no range is provided, defaults to {now(), now()}
 * @param funding 
 * @param range 
 */
export function isCurrentToRange(funding:Funding, range?: DateRange) : boolean {
	range = range ? range : { startDate: moment(), endDate: moment() }
	switch(funding.source) {
		case FundingSource.CDC:
			return isCurrentToRangeCDC(funding, range);

		case FundingSource.C4K:
			return isCurrentToRangeC4K(funding, range);

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
function isCurrentToRangeCDC(funding: Funding, range: DateRange) : boolean {
	if(
		(
			range.startDate
			&& funding.lastReportingPeriod
			&& range.startDate.isAfter(funding.lastReportingPeriod.periodEnd)
		)
	||
		(
			range.endDate
			&& funding.firstReportingPeriod
			&& range.endDate.isBefore(funding.firstReportingPeriod.periodStart)
		)
	)
	{
		return false;
	}

	return true;
}

/**
 * C4K funding does NOT overlap with range if:
 * - Certificate end date is before range start
 * - Certificate start date is after range ends
 * @param funding
 * @param range 
 */
function isCurrentToRangeC4K(funding: Funding, range: DateRange) : boolean {
	if(
		(
			range.startDate
			&& funding.certificateEndDate
			&& range.startDate.isAfter(funding.certificateEndDate)
		)
		||
		(
			range.endDate
			&& funding.certificateStartDate
			&& range.endDate.isBefore(funding.certificateStartDate)
		)
	)
	{
		return false;
	}
	return true;	
}

export function currentCdcFunding(fundings: DeepNonUndefineable<Funding[]> | null): DeepNonUndefineable<Funding> | undefined {
	return (fundings || [])
		.find<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.CDC && !funding.lastReportingPeriod);
}

export function currentC4kFunding(fundings: DeepNonUndefineable<Funding[]> | null): DeepNonUndefineable<Funding> | undefined {
	return (fundings || [])
		.find<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.C4K && funding.certificateEndDate === undefined);
}

export function createFunding({
	enrollmentId,
	source,
	time,
	firstReportingPeriod,
	familyId,
	certificateStartDate
}: {
	enrollmentId: number,
	source: FundingSource | null,
	time?: FundingTime,
	firstReportingPeriod?: ReportingPeriod,
	familyId?: number | null,
	certificateStartDate?: Date
}): Funding {
	switch (source) {
		case FundingSource.CDC:
			return {
				id: 0,
				enrollmentId,
				source,
				time,
				firstReportingPeriod,
			}
		case FundingSource.C4K:
			return {
				id: 0,
				enrollmentId,
				source,
				familyId,
				certificateStartDate
			}
		case null:
			return {
				id: 0,
				enrollmentId,
				source: undefined,
			}
		default:
			throw new Error("Something impossible happened");
	}
}

export function updateFunding({
	currentFunding,
	source,
	time,
	reportingPeriod,
	familyId,
	certificateStartDate
}: {
	currentFunding: Funding,
	source?: FundingSource,
	time?: FundingTime,
	reportingPeriod?: ReportingPeriod,
	familyId?: number | null,
	certificateStartDate?: Date
}): Funding {
	source = source ? source : currentFunding.source;
	switch (source) {
		case FundingSource.CDC:
			return {
				...currentFunding,
				source,
				time,
				firstReportingPeriodId : reportingPeriod ? reportingPeriod.id : undefined,
				firstReportingPeriod: reportingPeriod
			}
		case FundingSource.C4K:
			return {
				...currentFunding,
				source,
				familyId,
				certificateStartDate
			}
		default:
			throw new Error("Something impossible happened");
	}
}

export function hasFundings(enrollment: DeepNonUndefineable<Enrollment>): DeepNonUndefineable<Funding[]> | undefined {
	const fundings = enrollment.fundings;
	return !fundings ? undefined : fundings;
}

export function hasSourcelessFunding(enrollment: DeepNonUndefineable<Enrollment>): DeepNonUndefineable<Funding> | undefined {
	const fundings = hasFundings(enrollment);
	if (!fundings) {
		return undefined;
	}

	return fundings.find(funding => !funding.source);
}

export const NO_FUNDING = "private pay";
