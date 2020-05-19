import React from 'react';
import Table, { TableProps } from '../../../components/Table/Table';
import {
	CdcReport,
	Enrollment,
	Age,
	FundingTime,
	FundingSpace,
	FundingSource,
} from '../../../generated';
import idx from 'idx';
import moment from 'moment';
import {
	prettyAge,
	prettyFundingTime,
	fundingSpaceSorter,
} from '../../../utils/models';
import currencyFormatter from '../../../utils/currencyFormatter';
import cx from 'classnames';
import { DeepNonUndefineableArray } from '../../../utils/types';
import { countFundedEnrollments, calculateRate, makePrefixerFunc, ReimbursementRateLine } from '../../../utils/utilizationTable';

interface UtilizationTableRow {
	key: string;
	ageGroup?: Age;
	fundingTime?: FundingTime;
	count: number;
	capacity: number;
	rate?: number;
	total: number;
	balance: number;
	showFundingTime?: boolean;
	maxes: {
		total: number;
		rate: number;
		balance: number;
	};
}


export default function UtilizationTable(report: CdcReport) {
	const site = idx(report, _ => _.organization.sites[0]);
	if (!site) {
		return <></>;
	}

	const fundingSpaces = idx(report, (_) => _.organization.fundingSpaces);
	if (!fundingSpaces) {
		return <></>;
	}

	const periodStart = idx(report, (_) => _.reportingPeriod.periodStart);
	const periodEnd = idx(report, (_) => _.reportingPeriod.periodEnd);
	const weeksInPeriod =
		periodStart && periodEnd
			? moment(periodEnd)
				.add(1, 'day')
				.diff(periodStart, 'weeks')
			: 0;

	const enrollments = (idx(report, (_) => _.enrollments) || []) as Enrollment[];

	// NOTE: previously, looped over all possible combinations of age X time,
	// and then filtered for products with count or capacity > 0
	// UPDATED to loop over all existing fundingspaces, which will all have capacity > 0.
	// enrollments for funding spaces not in this list do not belong to this report.
	// Rows are sorted by fundingspace age, then time
	const cdcFundingSpaces = (fundingSpaces as DeepNonUndefineableArray<FundingSpace>)
		.sort(fundingSpaceSorter)
		.filter(fundingSpace => fundingSpace.source === FundingSource.CDC)

	let rows: UtilizationTableRow[] = cdcFundingSpaces.map(space => {
		const capacity = space.capacity;
		const ageGroup = space.ageGroup;
		const fundingTime = space.time;
		const count = countFundedEnrollments(enrollments, space.id);
		const rate = calculateRate(
			report.accredited,
			site.titleI,
			site.region,
			ageGroup,
			// TODO: Update this to handle FundingTime.Split
			fundingTime
		);

		const { timeSplitUtilizations } = space;
		const thisUtilization = (timeSplitUtilizations || []).find(u => u.reportId === report.id)
		let fullWeeks, partWeeks;
		if (thisUtilization) {
			fullWeeks = thisUtilization.fullTimeWeeksUsed
			partWeeks = thisUtilization.partTimeWeeksUsed
		}


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
			showFundingTime: cdcFundingSpaces.filter(fs => fs.ageGroup === ageGroup).length > 1,
			maxes: {
				// TODO: make this the greater of the two vals if there are two time vals
				total,
				rate,
				balance,
			},
		};
	});

	const totalRow = rows.reduce(
		(total, row) => {
			return {
				...total,
				count: total.count + row.count,
				capacity: total.capacity + row.capacity,
				total: total.total + row.total,
				balance: total.balance + row.balance,
				maxes: {
					total: Math.max(total.total, row.total),
					rate: Math.max(total.maxes.rate, row.rate || 0),
					balance: Math.max(Math.abs(total.balance), Math.abs(row.balance)),
				},
			};
		},
		{
			key: 'total',
			count: 0,
			capacity: 0,
			total: 0,
			balance: 0,
			maxes: {
				total: 0,
				rate: 0,
				balance: 0,
			},
		}
	);

	rows.push(totalRow);

	const reimbursementPrefixer = makePrefixerFunc(totalRow.maxes.rate);
	const totalPrefixer = makePrefixerFunc(totalRow.maxes.total);
	const balancePrefixer = makePrefixerFunc(totalRow.maxes.balance);

	const tableProps: TableProps<UtilizationTableRow> = {
		id: 'utilization-table',
		data: rows.filter((row) => row.count || row.capacity),
		rowKey: (row) => row.key,
		columns: [
			{
				name: '',
				cell: ({ row }) => (
					<th>
						<strong>{row.key === 'total' ? 'Total' : `${prettyAge(row.ageGroup)}`}</strong>
						{row.fundingTime && row.showFundingTime && <> &ndash; {prettyFundingTime(row.fundingTime, { splitTimeText: 'pt/ft split' })}</>}
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
				name: 'Reimbursement rate',
				className: 'text-right',
				cell: ({ row }) => {
					const prefix = reimbursementPrefixer(row.rate || 0);
					return (
						<td className="text-tabular text-right">
							{row.key !== 'total' && (
								<ReimbursementRateLine
									prefix={prefix}
									prettyRate={currencyFormatter(row.rate || 0, true)}
									weeksInPeriod={weeksInPeriod}
								/>
							)}
						</td>
					);
				},
			},
			{
				name: `Total (${weeksInPeriod} weeks)`,
				className: 'text-right',
				cell: ({ row }) => {
					const prefix = totalPrefixer(row.total);
					return (
						<td
							className={cx(
								{ 'oec-table__cell--strong': row.key === 'total' },
								'text-tabular',
								'text-right'
							)}
						>
							<span>$ </span>
							<span style={{ visibility: 'hidden' }}>{prefix}</span>
							{currencyFormatter(row.total, true)}
						</td>
					);
				},
			},
			{
				name: 'Balance',
				className: 'text-right',
				cell: ({ row }) => {
					const prefix = balancePrefixer(row.balance);
					return (
						<td
							className={cx(
								{ 'oec-table__cell--strong': row.key === 'total' },
								{ 'oec-table__cell--red': row.balance < 0 },
								'text-tabular',
								'text-right'
							)}
						>
							<div className={cx('position-relative', { 'one-half-char-right': row.balance < 0 })}>
								{row.balance < 0 ? '(' : ''}
								<span>$ </span>
								<span style={{ visibility: 'hidden' }}>{prefix}</span>
								{currencyFormatter(Math.abs(row.balance), true)}
								{row.balance < 0 ? ')' : ''}
							</div>
						</td>
					);
				},
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
