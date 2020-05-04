import { FundingSpace, Age, Organization, FundingSource, FundingTime } from '../../generated';
import { DeepNonUndefineable } from '../types';
import { prettyFundingTime } from './fundingTime';

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
export function prettyFundingSpaceTime(fundingSpace: FundingSpace, includeWeeks: boolean = false) {
	const FULL_YEAR_WEEKS = 52;
	if (fundingSpace.time !== FundingTime.Split) {
		return `${prettyFundingTime(fundingSpace.time, true)}${formattedWeeks(
			includeWeeks,
			FULL_YEAR_WEEKS
		)}`;
	}

	const fullTimeWeeks = fundingSpace.timeSplit ? fundingSpace.timeSplit.fullTimeWeeks : -1;
	const partTimeWeeks = fundingSpace.timeSplit ? fundingSpace.timeSplit.partTimeWeeks : -1;

	const fullTimeFirst = fullTimeWeeks > partTimeWeeks;

	if (fullTimeFirst) {
		return (
			`${prettyFundingTime(FundingTime.Full, true)}${formattedWeeks(includeWeeks, fullTimeWeeks)}` +
			` / ${prettyFundingTime(FundingTime.Part)}${formattedWeeks(includeWeeks, partTimeWeeks)}`
		);
	}

	return (
		`${prettyFundingTime(FundingTime.Part, true)}${formattedWeeks(includeWeeks, partTimeWeeks)}` +
		` / ${prettyFundingTime(FundingTime.Full)}${formattedWeeks(includeWeeks, fullTimeWeeks)}`
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
export function getFundingSpacesFor(
	fundingSpaces: DeepNonUndefineable<FundingSpace[]> | null | undefined,
	opts: {
		ageGroup?: Age;
		source?: FundingSource;
	}
) {
	if (!fundingSpaces) return [];
	const { ageGroup, source } = opts;
	return fundingSpaces.filter(space => {
		let match = true;
		if (ageGroup) {
			match = match && space.ageGroup === ageGroup;
		}
		if (source) {
			match = match && space.source === source;
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
		fundingSpaces = fundingSpaces.filter(fs => fs.source === opts.source);
	}

	if (opts.ageGroup) {
		fundingSpaces = fundingSpaces.filter(fs => fs.ageGroup === opts.ageGroup);
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
export function fundingSpaceSorter(
	a: DeepNonUndefineable<FundingSpace>,
	b: DeepNonUndefineable<FundingSpace>
) {
	if (a.ageGroup > b.ageGroup) return 1;
	if (a.ageGroup < b.ageGroup) return -1;

	// secondary sort by time
	if (a.time > b.time) return 1;
	if (a.time < b.time) return -1;

	return 0;
}
