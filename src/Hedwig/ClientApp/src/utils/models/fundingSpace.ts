import { FundingSpace, Age, Organization, FundingSource } from '../../generated';
import { DeepNonUndefineable } from '../types';
import { prettyFundingTime } from './fundingTime';

/**
 * Returns a prettified string for the collection of funding space time allocations
 * for a given fundingSpace. Allocations are sorted by descending weeks for pretty string, e.g.
 * - fundingSpaceTimeAllocations: [{time: 'Part', weeks: 52}]; prettified string: 'Part time (52 weeks)'
 * - fundingSpaceTimeAllocations: [{time: 'Full', weeks: 10}, {time: 'Part', weeks: 42}]; prettified string: 'Part time (42 weeks) / full time (10 weeks)'
 * @param fundingSpace 
 */
export function prettyFundingSpaceTimeAllocations(fundingSpace: DeepNonUndefineable<FundingSpace>) {
	if (!fundingSpace.fundingTimeAllocations) return '';

	const fundingTimeAllocations = fundingSpace.fundingTimeAllocations.sort(fta => fta.weeks);
	let str = '';
	fundingTimeAllocations.forEach((timeAllocation, idx) => {
		if (idx > 0) str += ' / ';
		str += `${prettyFundingTime(timeAllocation.time, idx === 0)} (${timeAllocation.weeks} weeks)`;
	});

	return str;
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
		ageGroup: Age;
		source: FundingSource | undefined;
	}
) {
	if (!fundingSpaces) return [];

	return fundingSpaces.filter(
		space => space.ageGroup == opts.ageGroup && space.source == opts.source
	);
}

/**
 * Returns time for associated FundingTimeAllocation
 * TODO: Update to handle FundingSpace with multiple FundingTimeAllocations
 * @param fundingSpace
 */
export function getFundingSpaceTime(fundingSpace: FundingSpace | undefined) {
	if (!fundingSpace) return;
	if (!fundingSpace.fundingTimeAllocations) return;
	if (!fundingSpace.fundingTimeAllocations.length) return;

	return fundingSpace.fundingTimeAllocations[0].time;
}

export function getCombinedCapacity(
	fundingSpaces: DeepNonUndefineable<FundingSpace[]> | null | undefined,
	source?: FundingSource
) {
	if (!fundingSpaces) return 0;

	let _fundingSpaces = fundingSpaces;
	if (source) {
		_fundingSpaces = _fundingSpaces.filter(fundingSpace => fundingSpace.source === source);
	}

	return _fundingSpaces.reduce((sum, space) => sum + space.capacity, 0);
}

/**
 * Returns the summed capacity for all fundingSpaces that meet the given filter criteria
 * @param organization
 * @param opts
 */
export function getFundingSpaceCapacity(
	organization: Organization | undefined,
	opts: { source?: string; ageGroup?: string; time?: string }
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

	if (opts.time) {
		fundingSpaces = fundingSpaces.filter(fs => getFundingSpaceTime(fs) === opts.time);
	}

	let capacity = 0;
	fundingSpaces.forEach(fs => {
		if (fs.capacity) capacity += fs.capacity;
	});

	return capacity;
}
