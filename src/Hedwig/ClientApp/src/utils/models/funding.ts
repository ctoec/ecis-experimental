import { DeepNonUndefineable } from "../types"
import { Funding, FundingSource } from "../../generated"
import Tag from "../../components/Tag/Tag";
import getColorForFundingSource, { fundingSourceDetails } from "../fundingTypeFormatters"

export function generateFundingTag(funding: DeepNonUndefineable<Funding>, index?: any): JSX.Element {
	let key = `${funding.source}-${funding.time}`;
	if(index) key = `${key}-${index}`;
	const text = funding.source ? fundingSourceDetails[funding.source].tagFormatter(funding) : '';
	const color = funding.source ? getColorForFundingSource(funding.source) : 'gray-90';
	return Tag({ key, text, color });
}

export function currentFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined
{
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.lastReportingPeriodId === undefined);
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
