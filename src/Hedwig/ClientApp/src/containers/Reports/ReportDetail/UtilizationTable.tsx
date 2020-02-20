import React from 'react';
import Table, { TableProps } from '../../../components/Table/Table';
import { CdcReport, Enrollment, Age, FundingSource, FundingTime, Region } from '../../../generated';
import idx from 'idx';
import moment from 'moment';
import { CdcRates } from './CdcRates';
import { prettyAge, prettyFundingTime } from '../../../utils/models';
import currencyFormatter from '../../../utils/currencyFormatter';
import cartesianProduct from '../../../utils/cartesianProduct';

interface UtilizationTableRow {
	key: string;
	ageGroup?: Age;
	fundingTime?: FundingTime;
	count: number;
	capacity: number;
	rate?: number;
	total: number;
	balance: number;
}

export default function UtilizationTable(report: CdcReport) {
	const site = idx(report, _ => _.organization.sites[0]);
	if (!site) {
		return <></>;
	}

	const periodStart = idx(report, _ => _.reportingPeriod.periodStart);
	const periodEnd = idx(report, _ => _.reportingPeriod.periodEnd);
	const weeksInPeriod =
		periodStart && periodEnd
			? moment(periodEnd)
					.add(1, 'day')
					.diff(periodStart, 'weeks')
			: 0;

	const enrollments = (idx(report, _ => _.enrollments) || []) as Enrollment[];

	let rows: UtilizationTableRow[] = cartesianProduct({
		ageGroup: [Age.InfantToddler, Age.Preschool, Age.SchoolAge],
		fundingTime: [FundingTime.Full, FundingTime.Part],
	})
		.map(({ ageGroup, fundingTime }) => {
			const capacity = findCapacity(report, ageGroup, fundingTime);
			const count = countEnrollments(enrollments, ageGroup, fundingTime);
			const rate = calculateRate(
				report.accredited,
				site.titleI,
				site.region,
				ageGroup,
				fundingTime
			);

			const cappedCount = Math.min(count, capacity);
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
			};
		})
		.filter(({ count, capacity }) => count > 0 || capacity > 0);

	const totalRow = rows.reduce(
		(total, row) => {
			return {
				...total,
				count: total.count + row.count,
				capacity: total.capacity + row.capacity,
				total: total.total + row.total,
				balance: total.balance + row.balance,
			};
		},
		{ key: 'total', count: 0, capacity: 0, total: 0, balance: 0 }
	);

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
						<strong>{row.key === 'total' ? 'Total' : `${prettyAge(row.ageGroup)}`}</strong>
						{row.fundingTime && <> &ndash; {prettyFundingTime(row.fundingTime)}</>}
					</th>
				),
			},
			{
				name: 'Utilization',
				cell: ({ row }) => (
					<td
						className={
							(row.key === 'total' ? 'oec-table__cell--strong' : '') +
							' ' +
							(row.count !== row.capacity ? 'oec-table__cell--red' : '')
						}
					>
						{row.count}/{row.capacity} spaces
					</td>
				),
			},
			{
				name: (
					<>
						Reimbursement <br />
						rate (weekly)
					</>
				),
				cell: ({ row }) => <td>{row.key !== 'total' && currencyFormatter(row.rate || 0)}</td>,
			},
			{
				name: `Total (${weeksInPeriod} weeks)`,
				cell: ({ row }) => (
					<td className={row.key === 'total' ? 'oec-table__cell--strong' : ''}>
						{currencyFormatter(row.total)}
					</td>
				),
			},
			{
				name: `Balance`,
				cell: ({ row }) => (
					<td
						className={
							(row.key === 'total' ? 'oec-table__cell--strong' : '') +
							' ' +
							(row.balance < 0 ? 'oec-table__cell--red' : '')
						}
					>
						{row.balance < 0 ? '(' : ''}
						{currencyFormatter(Math.abs(row.balance))}
						{row.balance < 0 ? ')' : ''}
					</td>
				),
			},
		],
	};

	return (
		<>
			<h2 className="margin-bottom-neg-205">Monthly utilization</h2>
			<Table {...tableProps} fullWidth />
		</>
	);
}

export function calculateRate(
	accredited: boolean,
	titleI: boolean,
	region: Region,
	ageGroup: Age,
	time: FundingTime
) {
	const rate = CdcRates.find(
		rate =>
			rate.accredited === accredited &&
			rate.titleI === titleI &&
			rate.region === region &&
			rate.ageGroup === ageGroup &&
			rate.time === time
	);

	return rate ? rate.rate : 0;
}

export function findCapacity(report: CdcReport, ageGroup: Age, fundingTime: FundingTime) {
	const fundingSpaces = idx(report, _ => _.organization.fundingSpaces) || [];

	return (
		idx(
			fundingSpaces.find(space => space.ageGroup === ageGroup && space.time === fundingTime),
			_ => _.capacity
		) || 0
	);
}

export function countEnrollments(
	enrollments: Enrollment[],
	ageGroup: Age,
	fundingTime: FundingTime
) {
	return enrollments.filter(enrollment => {
		if (enrollment.ageGroup !== ageGroup) {
			return false;
		}

		const cdcFunding = (idx(enrollment, _ => _.fundings) || []).find(
			funding => funding.source === FundingSource.CDC
		);

		return idx(cdcFunding, _ => _.time) === fundingTime;
	}).length;
}
