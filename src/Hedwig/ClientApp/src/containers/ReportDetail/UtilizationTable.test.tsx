import React from 'react';
import { mount } from 'enzyme';
import { Age, FundingTime, CdcReport, FundingSource, Enrollment, Region } from '../../generated';
import UtilizationTable, { calculateRate } from './UtilizationTable';
import emptyGuid from '../../utils/emptyGuid';

describe('calculateRate', () => {
  it('includes all possible rates', () => {
    [true, false].forEach(accredited => {
      [true, false].forEach(titleI => {
        [Region.East, Region.NorthCentral, Region.NorthWest, Region.SouthCentral, Region.SouthWest].forEach(region => {
          [Age.InfantToddler, Age.Preschool, Age.SchoolAge].forEach(ageGroup => {
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
    id: 1,
    organizationId: 1,
    accredited: true,
    type: FundingSource.CDC,
    reportingPeriod: {
      id: 1,
      type: FundingSource.CDC,
      period: new Date("2019-09-01"),
      dueAt: new Date("2019-10-15"),
      periodStart: new Date("2019-09-01"),
      periodEnd: new Date("2019-09-28"),
    },
    organization: {
      id: 1,
      name: "Test Organization",
      fundingSpaces: [
        {
          source: FundingSource.CDC,
          ageGroup: Age.Preschool,
          time: FundingTime.Full,
          capacity: 2,
          organizationId: 1
        },
      ],
      sites: [{
        name: "Test Site",
        region: Region.East,
        titleI: false,
        enrollments,
        organizationId: 1,
      }],
    },
  };

  return report;
};

const defaultReport = reportWithEnrollments([
  {
    id: 1,
    ageGroup: Age.Preschool,
    siteId: 1,
    childId: emptyGuid(),
    fundings: [{
      id: 1,
      source: FundingSource.CDC,
      time: FundingTime.Full,
      enrollmentId: 1,
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
        ageGroup: Age.InfantToddler,
        siteId: 1,
        childId: emptyGuid(),
        fundings: [{
          id: 1,
          source: FundingSource.CDC,
          time: FundingTime.Full,
          enrollmentId: 1
        }],
      },
      {
        id: 2,
        ageGroup: Age.InfantToddler,
        siteId: 1,
        childId: emptyGuid(),
        fundings: [{
          id: 1,
          source: FundingSource.CDC,
          time: FundingTime.Part,
          enrollmentId: 1
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
        siteId:1,
        childId: emptyGuid(),
        fundings: [{
          id: 1,
          source: FundingSource.CDC,
          time: FundingTime.Full,
          enrollmentId: 1
        }],
      }
    ]);

    const table = mount(<UtilizationTable {...report} />);

    expect(table.find('td').first().text()).toEqual("0/2 spaces")
  });
});
