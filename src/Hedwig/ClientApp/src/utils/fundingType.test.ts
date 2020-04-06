import moment from 'moment';
import { filterFundingTypesForRosterTags, FundingType } from './fundingType';

describe('fundingType utils', () => {
	it('filterFundingTypesForRosterTags filters fundings to given date range', () => {
		const outOfRangeFunding = {
			type: 'C4K' as 'C4K',
			id: 1,
			childId: '1',
			familyCertificateId: 1,
			startDate: new Date('2018-01-01'),
			endDate: new Date('2018-10-01'),
			validationErrors: null,
		} as FundingType;

		const range = { startDate: moment('2019-01-01'), endDate: null };

		const res = filterFundingTypesForRosterTags([outOfRangeFunding], range);

		expect(res.length).toBe(0);
	});
});
