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

// TODO: Rename currentCdcFunding
export function currentFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined
{
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.lastReportingPeriodId === undefined);
}

export function currentC4kFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined
{
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.certificateEndDate === undefined);
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

export const enrollmentExitReasons = {
	AgedOut: "Aged out",
	StoppedAttending: "Stopped attending",
	DifferentProgram: "Chose to attend a different program",
	MovedInCT: "Moved within Connecticut",
	MovedOutCT: "Moved to another state",
	LackOfPayment: "Withdrew due to lack of payment",
	AskedToLeave: "Child was asked to leave",
	Unknown: "Unknown",
};
