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

export function currentCdcFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined {
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.CDC && isCurrentToRange(funding));
}

export function currentC4kFunding(fundings: DeepNonUndefineable<Funding[]>): DeepNonUndefineable<Funding> | undefined {
	return fundings.find<DeepNonUndefineable<Funding>>(funding => funding.source === FundingSource.C4K && funding.certificateEndDate === undefined);
}

export function prepareFundings(
	fundings: DeepNonUndefineable<Funding[]>,
	{
		enrollment,
		sourcelessFunding,
		privatePay,
		cdcFundingId,
		cdcFunding,
		cdcFundingTime,
		cdcReportingPeriod,
		receivesC4k,
		c4kFundingId,
		c4kFunding,
		c4kCertificateStartDate,
		c4kFamilyId,
	} : {
		enrollment: Enrollment,
		sourcelessFunding: Funding | undefined,
		privatePay: boolean,
		cdcFundingId: number | null,
		cdcFunding: Funding | undefined,
		cdcFundingTime: FundingTime | null,
		cdcReportingPeriod: ReportingPeriod | undefined,
		receivesC4k: boolean,
		c4kFundingId: number | null,
		c4kFunding: Funding | undefined,
		c4kCertificateStartDate: Date | null,
		c4kFamilyId: number | null
	}) {
		// Begin by copying over all current fundings
		let updatedFundings = [...fundings] as Funding[];
		// CDC REGION
		if (sourcelessFunding) {
			// The user previously saved without selecting a funding from the ChoiceList
			if (!privatePay && !cdcFundingTime) {
				// The user still hasn't selected a funding
				// Do nothing
			} else {
				// The user has explicitly selected a funding
				// Remove this sourceless funding (we either need to update it or remove it)
				updatedFundings = updatedFundings.filter(funding => funding.id !== sourcelessFunding.id);
				if (privatePay) {
				// The user has explicitly selected private pay
				// We've already removed the sourceless funding
				} else if (cdcFundingTime) {
					// The user has explicitly selected a CDC funding
					// Update the funding
					updatedFundings.push(updateFunding({
						currentFunding: sourcelessFunding,
						source: FundingSource.CDC,
						time: cdcFundingTime,
						reportingPeriod: cdcReportingPeriod
					}));
				}
			}
		} else {
			// There is no sourceless funding
			if (cdcFundingId && cdcFunding) {
				// Current funding exists
				// Remove current current (we either need to update it or remove it)
				updatedFundings = updatedFundings.filter(funding => funding.id !== cdcFundingId);
				if (!privatePay && cdcFundingTime) {
					// The funding is to be updated, so add it back with the new values
					updatedFundings.push(updateFunding({
						currentFunding: cdcFunding,
						time: cdcFundingTime,
						reportingPeriod: cdcReportingPeriod
					}));
				} else if (privatePay && !cdcFundingTime) {
					// The funding is to be removed
					// Do nothing
				} else if (!privatePay && !cdcFundingTime) {
					// '- Select -' was chosen
					updatedFundings.push(createFunding({
						enrollmentId: enrollment.id,
						source: null
					}))
				} else {
					// privatePay and cdcFundingTime should never both be value-ful
					throw new Error("Something impossible happened");
				}
			} else {
				// No current funding exists
				if (cdcFundingTime && !privatePay) {
					// There should be a new funding added
					updatedFundings.push(createFunding({
						enrollmentId: enrollment.id,
						source: FundingSource.CDC,
						time: cdcFundingTime,
						firstReportingPeriodId: cdcReportingPeriod ? cdcReportingPeriod.id : undefined
					}));
				} else if (!cdcFunding && privatePay) {
					// User selected private pay, do nothing
				} else if (!cdcFunding && !privatePay) {
					// User did not select a funding, create a source-less funding
					updatedFundings.push(createFunding({
						enrollmentId: enrollment.id,
						source: null
					}));
				}
				else /* (cdcFundingTime && privatePay) */ {
					throw new Error("Something impossible happened");
				}
			}
		}
		// END CDC REGION

		// C4K REGION
		if (c4kFundingId && c4kFunding) {
			// Remove current current (we either need to update it or remove it)
			// Remove 
			updatedFundings = updatedFundings.filter(funding => funding.id !== c4kFundingId);
			if (!receivesC4k) {
				// The user has explicitly removed c4k funding
				// We've already removed the funding, so do nothing
			} else {
				// The funding is to be updated, so add it back with the new values
				updatedFundings.push(updateFunding({
					currentFunding: c4kFunding,
					certificateStartDate: c4kCertificateStartDate ? c4kCertificateStartDate : undefined,
					familyId: c4kFamilyId
				}));
			}
		} else {
			// No current funding, add new funding with supplied information
			if (receivesC4k) {
				updatedFundings.push(createFunding({
					enrollmentId: enrollment.id,
					source: FundingSource.C4K,
					certificateStartDate: c4kCertificateStartDate ? c4kCertificateStartDate : undefined,
					familyId: c4kFamilyId
				}))
			} else {
				// No current funding, do nothing because receives C4K has not been selected
			}
		}
		// END C4K REGION

		return updatedFundings;
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

export const NO_FUNDING = "private pay";
