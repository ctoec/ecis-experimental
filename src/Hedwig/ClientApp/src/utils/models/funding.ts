import { DeepNonUndefineable } from "../types"
import { Funding, FundingSource, FundingTime, ReportingPeriod } from "../../generated"
import { Tag } from "../../components";
import getColorForFundingSource, { fundingSourceDetails } from "../fundingTypeFormatters"
import moment from "moment";


export function generateFundingTag(funding: DeepNonUndefineable<Funding>, index?: any): JSX.Element {
	let key = `${funding.source}-${funding.time}`;
	if(index) key = `${key}-${index}`;
	const text = funding.source ? fundingSourceDetails[funding.source].tagFormatter(funding) : 'Not specified';
	const color = funding.source ? getColorForFundingSource(funding.source) : 'gray-90';
	return Tag({ key, text, color });
}

export function isCurrent(funding:Funding) : boolean {
	switch(funding.source) {
		case FundingSource.CDC:
			return isCurrentCDC(funding);

		case FundingSource.C4K:
			return isCurrentC4K(funding);

		default:
			return false;
	}

}

export function isCurrentCDC(funding: Funding) : boolean {
	const now = moment();
	return (
		// has no last reporting period
		!funding.lastReportingPeriodId
		// or end of last reporting period is in the future
		|| !!(funding.lastReportingPeriod && now.isSameOrBefore(funding.lastReportingPeriod.periodEnd))
	)
	&& (
		// has no first reporting period
		!funding.firstReportingPeriodId
		// start of first reporting period is in the past
		|| !!(funding.firstReportingPeriod && now.isSameOrAfter(funding.firstReportingPeriod.periodStart))
	);
}

export function isCurrentC4K(funding: Funding) : boolean {
	const now = moment();
	return (
		// has no cert end date
		!funding.certificateEndDate
		// or cert end date is in the future
		|| !!(funding.certificateEndDate && now.isSameOrBefore(funding.certificateEndDate))
	)
	&& (
		// hast no cert start
		!funding.certificateStartDate
		// or cert start is in the past
		|| !!(funding.certificateStartDate && now.isSameOrAfter(funding.certificateStartDate))
	)
}

// TODO: Rename currentCdcFunding
export function currentCdcFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined {
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.CDC && isCurrentCDC(funding));
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
