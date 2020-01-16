import { DeepNonUndefineable } from "../types"
import { Funding, FundingSource, FundingTime, ReportingPeriod } from "../../generated"
import { Tag } from "../../components";
import getColorForFundingSource, { fundingSourceDetails } from "../fundingTypeFormatters"


export function generateFundingTag(funding: DeepNonUndefineable<Funding>, index?: any): JSX.Element {
	let key = `${funding.source}-${funding.time}`;
	if(index) key = `${key}-${index}`;
	const text = funding.source ? fundingSourceDetails[funding.source].tagFormatter(funding) : 'Not specified';
	const color = funding.source ? getColorForFundingSource(funding.source) : 'gray-90';
	return Tag({ key, text, color });
}

export type DateDateRange = {
	startDate: Date | null,
	endDate: Date | null,
}

/**
 * Returns true if the funding overlaps with the provided range.
 * If no range is provided, defaults to {now(), now()}
 * @param funding 
 * @param range 
 */
export function isCurrentToRange(funding:Funding, range?: DateDateRange) : boolean {
	range = range ? range : { startDate: new Date(Date.now()), endDate: new Date(Date.now()) }
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
export function isCurrentToRangeCDC(funding: Funding, range: DateDateRange) : boolean {
	if(
		(
			range.startDate
			&& funding.lastReportingPeriod
			&& funding.lastReportingPeriod.periodEnd < range.startDate
		) 
		&&
		(
			range.endDate
			&& funding.firstReportingPeriod
			&& funding.firstReportingPeriod.periodStart > range.endDate
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
export function isCurrentToRangeC4K(funding: Funding, range: DateDateRange) : boolean {
	if(
		(
			range.startDate
			&& funding.certificateEndDate
			&& funding.certificateEndDate < range.startDate
		)
		&&
		(
			range.endDate
			&& funding.certificateStartDate
			&& funding.certificateStartDate > range.endDate
		)
	)
	{
		return false;
	}
	return true;
}

export function currentCdcFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined {
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.CDC && isCurrentToRange(funding));
}

export function currentC4kFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined {
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.C4K && funding.certificateEndDate === undefined);
}

export function createFunding({
	enrollmentId,
	source,
	time,
	firstReportingPeriodId,
	familyId,
	certificateStartDate
}: {
	enrollmentId: number,
	source: FundingSource | null,
	time?: FundingTime,
	firstReportingPeriodId?: number,
	familyId?: number,
	certificateStartDate?: Date
}): Funding {
	switch (source) {
		case FundingSource.CDC:
			return {
				id: 0,
				enrollmentId,
				source,
				time,
				firstReportingPeriodId,
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
	familyId?: number,
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

export const NO_FUNDING = "private pay";
