import { FundingSpace, FundingTime, Age } from '../../generated';
import { DeepNonUndefineable } from '../types';

export function getFundingSpaceFor(
	fundingSpaces?: DeepNonUndefineable<FundingSpace[]> | null,
	opts?: {
		ageGroup?: Age,
		time?: FundingTime
	}) {
		if(!fundingSpaces) return;
		
		const _opts = opts || {};
		const [fundingSpace] = fundingSpaces
			.filter((fundingSpace) => {
				let matches = true;
				if(_opts.ageGroup) {
					matches = matches && fundingSpace.ageGroup === _opts.ageGroup;
				}

				if(_opts.time) {
					matches = matches && fundingSpace.time === _opts.time;
				}

				return matches;
			});

		return fundingSpace;
	}
