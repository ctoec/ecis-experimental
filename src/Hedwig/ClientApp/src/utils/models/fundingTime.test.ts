import { getFundingSpaceTimes } from './fundingSpace';
import { mockSplitSpace } from '../../tests/data/fundingSpace';
import { prettyFundingTime } from '.';

describe('funding time utils', () => {
	it('pretty funding space time formats a split correctly', () => {
		const prettyFormattedSplitSpace = prettyFundingTime(getFundingSpaceTimes(mockSplitSpace));
		expect(prettyFormattedSplitSpace).toMatch(/part time \/ full time/i);
	});
});
