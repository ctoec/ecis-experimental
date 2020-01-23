import { isCurrentToRange, filterFundingsForRosterTags } from './funding';
import { FundingSource, FundingTime, Funding, ReportingPeriod } from '../../generated';
import moment from 'moment';

it('filterFundingsForRosterTags deduplicates fundings based on source and time values', () => {
  const baseFunding = { id: 1, enrollmentId: 1 };
  const fundings : Funding[] = [
   { ...baseFunding, source: FundingSource.CDC, time: FundingTime.Full },
   { ...baseFunding, source: FundingSource.CDC, time: FundingTime.Part },
   { ...baseFunding, source: FundingSource.C4K, time: FundingTime.Full },
 ]
  const duplicatedFundings = [
    ...fundings,
    ...fundings
  ];

  const res = filterFundingsForRosterTags(duplicatedFundings);

  expect(res.length).toBe(fundings.length);
});

it('filterFundingsForRosterTags filters fundings to given date range', () => {
  const outOfRangeFunding = {
    id: 1,
    enrollmentId: 1,
    source: FundingSource.C4K,
    certificateStartDate: new Date('2018-01-01'),
    certificateEndDate: new Date('2018-10-01')
  };

  const range = { startDate: moment('2019-01-01'), endDate: null };

  const res = filterFundingsForRosterTags([outOfRangeFunding], range);

  expect(res.length).toBe(0);
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
  ['2019-10-01', '2020-01-15', '2020-01-01', '2020-01-01', true]
])
('determines if CDC funding (%s - %s) is current to given range (%s - %s)', (
  firstPeriodStart, lastPeriodEnd, rangeStart, rangeEnd, isCurrent
) => {
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
      periodStart: new Date(firstPeriodStart as string)
    },
    lastReportingPeriod: {
      ...baseReportingPeriod,
      periodEnd: new Date(lastPeriodEnd as string)
    },
  };

  const range = {
    startDate: moment(rangeStart as string),
    endDate: moment(rangeEnd as string)
  };

  const res = isCurrentToRange(funding, range);
  expect(res).toBe(isCurrent);
});

it.each([
  // cert end date is before range start
  ['2019-10-01', '2019-10-30', '2020-01-01', '2020-01-15', false],
  // cert start date period is after range end
  ['2020-02-01', '2020-02-28', '2020-01-01', '2020-01-15', false],
  // cert start date is before range end and
  // and cert end date is after range start
  ['2019-10-01', '2020-01-10', '2020-01-01', '2020-01-15', true],
  // works for a range of one date that lies within the funding dates
  ['2019-10-01', '2020-01-15', '2020-01-01', '2020-01-01', true]
])
('determines if CDC funding (%s - %s) is current to given range (%s - %s)', (
  certStart, certEnd, rangeStart, rangeEnd, isCurrent
) => {
  const baseFunding = { id: 1, enrollmentId: 1, source: FundingSource.C4K };

  const funding: Funding = {
    ...baseFunding,
    certificateStartDate: new Date(certStart as string),
    certificateEndDate: new Date(certEnd as string)
  };

  const range = {
    startDate: moment(rangeStart as string),
    endDate: moment(rangeEnd as string)
  };

  const res = isCurrentToRange(funding, range);
  expect(res).toBe(isCurrent);
});