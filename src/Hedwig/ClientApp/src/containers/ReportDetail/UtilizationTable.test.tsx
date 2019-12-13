import React from 'react';
import { mount } from 'enzyme';
import { Region } from './CdcRates';
import { Age, FundingTime, CdcReport, FundingSource, Enrollment } from '../../generated';
import UtilizationTable, { calculateRate } from './UtilizationTable';

describe('calculateRate', () => {
  it('includes all possible rates', () => {
    [true, false].forEach(accredited => {
      [true, false].forEach(titleI => {
        [Region.E, Region.NC, Region.NW, Region.SC, Region.SW].forEach(region => {
          [Age.Infant, Age.Preschool, Age.School].forEach(ageGroup => {
            [FundingTime.Full, FundingTime.Part].forEach(time => {
              const rate = calculateRate(accredited, titleI, region, ageGroup, time);
              expect(rate).toBeGreaterThan(0);
            });
          });
        });
      });
    });
  });
});

const reportWithEnrollments = (enrollments: Enrollment[]) => {
  const report: CdcReport = {
    accredited: true,
    type: FundingSource.CDC,
    reportingPeriod: {
      periodStart: new Date("2019-09-01"),
      periodEnd: new Date("2019-09-28"),
    },
    organization: {
      name: "Test Organization",
      fundingSpaces: [
        {
          source: FundingSource.CDC,
          ageGroup: Age.Preschool,
          time: FundingTime.Full,
          capacity: 2
        },
      ],
      sites: [{
        name: "Test Site",
        enrollments,
      }],
    },
  };

  return report;
};

const defaultReport = reportWithEnrollments([
  {
    id: 1,
    ageGroup: Age.Preschool,
    fundings: [{
      source: FundingSource.CDC,
      time: FundingTime.Full,
    }],
  }
]);

describe('UtilizationTable', () => {
  it('matches snapshot', () => {
    const table = mount(<UtilizationTable {...defaultReport} />);
    expect(table.html()).toMatchSnapshot();
  });

  it('includes a row for each type of enrollment and funding space', () => {
    const report = reportWithEnrollments([
      {
        id: 1,
        ageGroup: Age.Infant,
        fundings: [{
          source: FundingSource.CDC,
          time: FundingTime.Full,
        }],
      },
      {
        id: 2,
        ageGroup: Age.Infant,
        fundings: [{
          source: FundingSource.CDC,
          time: FundingTime.Part,
        }],
      },
    ]);

    const table = mount(<UtilizationTable {...report} />);

    expect(table.find('tr')).toHaveLength(5);
  });

  it('does not include enrollments without an age', () => {
    const report = reportWithEnrollments([
      {
        id: 1,
        ageGroup: undefined,
        fundings: [{
          source: FundingSource.CDC,
          time: FundingTime.Full,
        }],
      }
    ]);

    const table = mount(<UtilizationTable {...report} />);

    expect(table.find('td').first().text()).toEqual("0/2 spaces")
  });
});
