import { getFundingSpaceTime, getFundingSpaceFor, getFundingSpaceCapacity } from './fundingSpace';
import { mockFundingSpaces } from '../../tests/data/fundingSpace';
import { Age, FundingSpace, FundingTime } from '../../generated';
import { DeepNonUndefineable } from '../types';

describe('funding space utils', () => {
	describe('getFundingSpaceFor', () => {
		it('returns a funding space given ', () => {
			const fundingSpace = getFundingSpaceFor(
				mockFundingSpaces as DeepNonUndefineable<FundingSpace[]>,
				{
					ageGroup: Age.InfantToddler,
					time: FundingTime.Full,
				}
			);
			expect(fundingSpace).toHaveProperty('ageGroup');
		});
	});
	describe('getFundingSpaceTime', () => {
		it('returns part time', () => {});
		it('returns full time', () => {});
		it('returns part time full time split', () => {});
	});
});
