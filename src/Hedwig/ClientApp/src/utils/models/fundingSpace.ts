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
		time: FundingTime | undefined;
	}
) {
	if (!fundingSpaces) return;

	const [fundingSpace] = fundingSpaces.filter(
		space => space.ageGroup == opts.ageGroup && getFundingSpaceTime(space) == opts.time
	);

	return fundingSpace;
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

	const uniqueFundingTimes = fundingSpace.fundingTimeAllocations
		.map(space => space.time)
		.filter((time, index, timesArray) => timesArray.indexOf(time) === index);
	if (uniqueFundingTimes.length === 1) {
		// If there's only one type of funding time in the allocations, then return that
		return uniqueFundingTimes[0];
	}
	// Use "Part time / full time" when a FundingSpace includes a mix of part- and full-time weeks.
	console.log('split');
	return `${uniqueFundingTimes.sort().reverse().join(' time / ')} time`;
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
