import { getFundingSpaces, prettyFundingSpaceTime } from './fundingSpace';
import { mockFundingSpaces } from '../../tests/data/fundingSpace';
import { FundingSpace, FundingTime, FundingTimeSplit, Age, FundingSource } from '../../generated';
import { DeepNonUndefineable } from '../types';

describe('funding space utils', () => {
	it('getFundingSpaceFor returns a funding space given ', () => {
		const returnedSpaces = getFundingSpaces(
			mockFundingSpaces as DeepNonUndefineable<FundingSpace[]>,
			{
				ageGroup: Age.InfantToddler,
				source: FundingSource.CDC,
			}
		);

		returnedSpaces.forEach(space => {
			expect(space).toHaveProperty('ageGroup', Age.InfantToddler);
			expect(space).toHaveProperty('source', FundingSource.CDC);
		});
	});

	it.each([
		[{ time: FundingTime.Full, timeSplit: undefined }, true, 'Full time (52 weeks)'],
		[{ time: FundingTime.Part, timeSplit: undefined }, false, 'Part time'],
		[
			{ time: FundingTime.Split, timeSplit: { fullTimeWeeks: 10, partTimeWeeks: 42 } },
			true,
			'Part time (42 weeks) / full time (10 weeks)',
		],
		[
			{ time: FundingTime.Split, timeSplit: { fullTimeWeeks: 32, partTimeWeeks: 20 } },
			false,
			'Full time / part time',
		],
	])('prettyFundingSourceString formats correctly', (spaceOpts, includeWeeks, prettyString) => {
		const mockFundingSpace = { ...mockFundingSpaces[0] };
		mockFundingSpace.time = spaceOpts.time;
		mockFundingSpace.timeSplit = spaceOpts.timeSplit as FundingTimeSplit;
		const res = prettyFundingSpaceTime(mockFundingSpace, includeWeeks);

		expect(res).toEqual(prettyString);
	});
});
