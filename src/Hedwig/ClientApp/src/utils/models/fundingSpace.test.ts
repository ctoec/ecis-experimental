import { getFundingSpaceTimes, getFundingSpaceFor, getFundingSpaceCapacity } from './fundingSpace';
import { mockFundingSpaces } from '../../tests/data/fundingSpace';
import { Age, FundingSpace, FundingTime } from '../../generated';
import { DeepNonUndefineable } from '../types';

describe('funding space utils', () => {
	it('getFundingSpaceFor returns a funding space given ', () => {
		const fundingSpace = getFundingSpaceFor(
			mockFundingSpaces as DeepNonUndefineable<FundingSpace[]>,
			{
				ageGroup: Age.InfantToddler,
				time: FundingTime.Full,
			}
		);
		expect(fundingSpace).toMatchObject({
			source: 'CDC',
			ageGroup: 'InfantToddler',
			fundingTimeAllocations: [{ time: 'Full', weeks: 52 }],
			capacity: 10,
			organizationId: 1,
		});
	});

	it('pretty funding space time formats a split correctly', () => {});

	describe('getFundingSpaceTimes returns the correct values', () => {
		it('formats full/part correctly', () => {
			// const fundingSpaceTimes = getFundingSpaceTimes(mockFundingSpaces);
		});
	});
});
