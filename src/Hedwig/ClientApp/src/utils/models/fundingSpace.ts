import { FundingSpace, FundingTime, Age } from '../../generated';
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
		space => space.ageGroup == opts.ageGroup && space.time == opts.time
	);

	return fundingSpace;
}
