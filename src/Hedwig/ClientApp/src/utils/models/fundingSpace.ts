import { FundingSpace, FundingTime, Age, Organization } from '../../generated';
import { DeepNonUndefineable } from '../types';

/**
 * Returns the fundingSpace with given ageGroup and time value,
 * or undefined if no matching fundingSpace found
 * (There cannot be multiple fundingSpaces with the same ageGroup and time)
 *
 * @param fundingSpaces
 * @param opts
 */
export function getFundingSpaceFor(
	fundingSpaces: DeepNonUndefineable<FundingSpace[]> | null | undefined,
	opts: {
		ageGroup: Age;
		time?: FundingTime | FundingTime[] | undefined;
	}
) {
	if (!fundingSpaces) return;
	let timeOpt = Array.isArray(opts.time) ? opts.time : [opts.time];

	const [fundingSpace] = fundingSpaces.filter(space => {
		let match = space.ageGroup === opts.ageGroup;
		const spaceTimes = getFundingSpaceTimes(space);
		if (spaceTimes && opts.time) {
			match = match && spaceTimes.sort().join() === timeOpt.sort().join();
		}
		return match;
	});

	return fundingSpace;
}

// Returns unique times for a funding space sorted alphabetically
export function getFundingSpaceTimes(
	fundingSpace: FundingSpace | undefined
): FundingTime[] | undefined {
	if (!fundingSpace) return;
	if (!fundingSpace.fundingTimeAllocations) return;
	if (!fundingSpace.fundingTimeAllocations.length) return;
	const uniqueFundingTimes = fundingSpace.fundingTimeAllocations
		.map(space => space.time)
		.filter((time, index, timesArray) => timesArray.indexOf(time) === index)
		.sort();
	return uniqueFundingTimes;
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
