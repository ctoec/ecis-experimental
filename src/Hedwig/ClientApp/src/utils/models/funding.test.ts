import { isCurrentFundingToRange } from './funding';
import { FundingSource, FundingTime, Funding, ReportingPeriod } from '../../generated';
import moment from 'moment';
import { filterFundingTypesForRosterTags, FundingType } from '../fundingType';

describe('funding utils', () => {
	it('filterFundingTypesForRosterTags deduplicates fundings based on source and time values', () => {
		const baseFunding = { id: 1, enrollmentId: 1, type: 'CDC' as 'CDC' };
		const baseFundingSource = { organizationId: 1, capacity: 1 };
		const fundings: FundingType[] = [
			{
				...baseFunding,
				source: FundingSource.CDC,
				fundingSpace: {
					time: FundingTime.Full,
				},
			} as FundingType,
			{
				...baseFunding,
				source: FundingSource.CDC,
				fundingSpace: {
					time: FundingTime.Part,
				},
			} as FundingType,
		];
		const duplicatedFundings = [...fundings, ...fundings];

		const res = filterFundingTypesForRosterTags(duplicatedFundings);

		expect(res.length).toBe(fundings.length);
	});

	it.each([
		// end of last reporting period is before range start
		['2019-10-01', '2019-10-30', '2020-01-01', '2020-01-15', false],
		// start of first reporting period is after range end
		['2020-02-01', '2020-02-28', '2020-01-01', '2020-01-15', false],
		// start of first reporting period is before range end and
		// and end of last reporting period is after range start
		['2019-10-01', '2020-01-10', '2020-01-01', '2020-01-15', true],
		// works for a range of one date that lies within the funding dates
		['2019-10-01', '2020-01-15', '2020-01-01', '2020-01-01', true],
	])(
		'determines if CDC funding (%s - %s) is current to given range (%s - %s)',
		(firstPeriodStart, lastPeriodEnd, rangeStart, rangeEnd, isCurrent) => {
			const baseReportingPeriod: ReportingPeriod = {
				id: 1,
				type: FundingSource.CDC,
				period: new Date(Date.now()),
				periodStart: new Date(Date.now()),
				periodEnd: new Date(Date.now()),
				dueAt: new Date(Date.now()),
			};

			const baseFunding = { id: 1, enrollmentId: 1, source: FundingSource.CDC };

			const funding: Funding = {
				...baseFunding,
				firstReportingPeriod: {
					...baseReportingPeriod,
					periodStart: new Date(firstPeriodStart as string),
				},
				lastReportingPeriod: {
					...baseReportingPeriod,
					periodEnd: new Date(lastPeriodEnd as string),
				},
			};

			const range = {
				startDate: moment(rangeStart as string),
				endDate: moment(rangeEnd as string),
			};

			const res = isCurrentFundingToRange(funding, range);
			expect(res).toBe(isCurrent);
		}
	);
});
