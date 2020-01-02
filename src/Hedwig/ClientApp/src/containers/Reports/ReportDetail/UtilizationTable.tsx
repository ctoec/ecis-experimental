import React from 'react';
import Table, { TableProps } from '../../../components/Table/Table';
import { CdcReport, Age, FundingTime, Region } from '../../../generated';
import idx from 'idx';
import moment from 'moment';
import { CdcRates } from './CdcRates';
import { prettyAge } from '../../../utils/ageGroupUtils';
import { prettyFundingTime } from '../../../utils/fundingTimeUtils';
import currencyFormatter from '../../../utils/currencyFormatter';

export function calculateRate(accredited: boolean, titleI: boolean, region: Region, ageGroup: Age, time: FundingTime) {
  const rate = CdcRates.find(rate =>
    rate.accredited === accredited &&
    rate.titleI === titleI &&
    rate.region === region &&
    rate.ageGroup === ageGroup &&
    rate.time === time
  );

  return rate ? rate.rate : 0;
}

interface UtilizationTableRow {
  key: string
  ageGroup?: Age
  fundingTime?: FundingTime
  count: number
  capacity: number
  rate?: number
  total: number
  balance: number
}

export default function UtilizationTable(report: CdcReport) {
  const periodStart = idx(report, _ => _.reportingPeriod.periodStart);
  const periodEnd = idx(report, _ => _.reportingPeriod.periodEnd);
  const weeksInPeriod = periodStart && periodEnd ? moment(periodEnd).add(1, 'day').diff(periodStart, 'weeks') : 0;

  const accredited = report.accredited;
  const fundingSpaces = idx(report, _ => _.organization.fundingSpaces) || [];

  const sites = idx(report, _ => _.organization.sites) || [];
  const ageGroups = [Age.InfantToddler, Age.Preschool, Age.SchoolAge];
  const fundingTimes = [FundingTime.Full, FundingTime.Part];

  const rows: UtilizationTableRow[] = sites.flatMap(site => {
    const region = site.region;
    const titleI = site.titleI;

    const enrollments = site.enrollments.flatMap(enrollment => {
      const cdcFunding = enrollment.fundings.find(funding => funding.source === report.type);
      if (!cdcFunding) { return []; }
      return {
        ageGroup: enrollment.ageGroup,
        time: cdcFunding.time,
      };
    });

    return ageGroups.flatMap(ageGroup => fundingTimes.flatMap(fundingTime => {
      const count = enrollments
        .filter(enrollment => enrollment.ageGroup === ageGroup && enrollment.time === fundingTime)
        .length;

      const capacity = idx(
        fundingSpaces.find(space => space.ageGroup === ageGroup && space.time === fundingTime),
        _ => _.capacity
      ) || 0;

      const cappedCount = Math.min(count, capacity);

      const rate = calculateRate(accredited, titleI, region, ageGroup, fundingTime);

      const total = cappedCount * rate * weeksInPeriod;
      const paid = capacity * rate * weeksInPeriod;
      const balance = total - paid;

      return {
        key: `${ageGroup}-${fundingTime}`,
        ageGroup,
        fundingTime,
        count,
        capacity,
        rate,
        total,
        balance,
      }
    }));
  });

  const totalRow = rows.reduce((total, row) => {
    return {
      ...total,
      count: total.count + row.count,
      capacity: total.capacity + row.capacity,
      total: total.total + row.total,
      balance: total.balance + row.balance,
    };
  }, { key: 'total', count: 0, capacity: 0, total: 0, balance: 0 });

  rows.push(totalRow);

  const tableProps: TableProps<UtilizationTableRow> = {
    id: 'utilization-table',
    data: rows.filter(row => row.count || row.capacity),
    rowKey: row => row.key,
    columns: [
      {
        name: '',
        cell: ({ row }) => (
          <th>
            <strong>
              {row.key === 'total' ? 'Total' : `${prettyAge(row.ageGroup)}`}
            </strong>
            {row.fundingTime && (
              <> &ndash; {prettyFundingTime(row.fundingTime)}</>
            )}
          </th>
        )
      },
      {
        name: 'Utilization',
        cell: ({ row }) => (
          <td className={
            (row.key === "total" ? "oec-table__cell--strong" : "") + " " +
            (row.count !== row.capacity ? "oec-table__cell--red" : "")
          }>
            {row.count}/{row.capacity} spaces
          </td>
        )
      },
      {
        name: <>Reimbursement <br />rate (weekly)</>,
        cell: ({ row }) => (
          <td>
            {row.key !== 'total' && currencyFormatter(row.rate || 0)}
          </td>
        )
      },
      {
        name: `Total (${weeksInPeriod} weeks)`,
        cell: ({ row }) => (
          <td className={row.key === "total" ? "oec-table__cell--strong" : ""}>
            {currencyFormatter(row.total)}
          </td>
        )
      },
      {
        name: `Balance`,
        cell: ({ row }) => (
          <td className={
            (row.key === "total" ? "oec-table__cell--strong" : "") + " " +
            (row.balance < 0 ? "oec-table__cell--red" : "")
          }>
            {row.balance < 0 ? '(' : ''}
            {currencyFormatter(Math.abs(row.balance))}
            {row.balance < 0 ? ')' : ''}
          </td>
        )
      }
    ]
  }

  return <>
    <h2 className="margin-bottom-neg-205">Monthly utilization</h2>
    <Table {...tableProps} fullWidth />
  </>
}
