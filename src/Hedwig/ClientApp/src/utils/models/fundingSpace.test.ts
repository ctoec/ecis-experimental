import { getFundingSpacesFor } from './fundingSpace';
import { mockFundingSpaces, mockSplitSpace } from '../../tests/data/fundingSpace';
import { FundingSpace } from '../../generated';
import { DeepNonUndefineable } from '../types';

describe('funding space utils', () => {
	it('getFundingSpaceFor returns a funding space given ', () => {
		const returnedSpaces = getFundingSpacesFor(
			mockFundingSpaces as DeepNonUndefineable<FundingSpace[]>,
			{
				ageGroup: mockSplitSpace.ageGroup,
				time: mockSplitSpace.fundingTimeAllocations.map(t => t.time),
			}
		);
		expect(returnedSpaces).toMatchObject([mockSplitSpace]);
	});
});
