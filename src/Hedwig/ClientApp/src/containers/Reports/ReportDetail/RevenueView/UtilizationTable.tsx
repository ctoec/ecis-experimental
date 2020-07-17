import React from 'react';
import { Table, TableProps, useGenericContext, FormContext } from '@ctoec/component-library';
import {
	CdcReport,
} from '../../../../generated';
import {
	prettyAge,
	prettyFundingTime,
	getReportingPeriodWeeks,
} from '../../../../utils/models';
import currencyFormatter from '../../../../utils/currencyFormatter';
import cx from 'classnames';
import {
	makePrefixerFunc,
	ReimbursementRateLine,
} from '../../../../utils/utilizationTable';
import { RevenueDataRow, getRevenueDataRows } from '../utils/getRevenueDataRows';

type UtilizationTableRow = RevenueDataRow & {
	showFundingTime?: boolean;
	// Used for numeral alignment formatting
	maxes: {
		total: number;
		rate: number;
		balance: number;
	};
}

export default function UtilizationTable() {
	const { data: report } = useGenericContext<CdcReport>(FormContext);

	// Transform RevenueDataRow into UtilizationTableRow
	let rows: UtilizationTableRow[] = getRevenueDataRows(report).map((row) => ({
		...row,
		showFundingTime: (report.organization?.fundingSpaces || []).filter((fs) => fs.ageGroup === row.ageGroup).length > 1,
		maxes: {
			total: row.total,
			balance: row.balance,
			rate: Math.max(row.ptRate || 0, row.ftRate || 0)
		}
	}));

	// And do reduce transformation for total row
	let totalRow = rows[rows.length - 1];
	totalRow = rows.reduce(
		(total, row) => ({
			...total,
			maxes: {
				total: Math.max(total.total, row.total),
				rate: Math.max(total.maxes.rate, row.ftRate || 0, row.ptRate || 0),
				balance: Math.max(Math.abs(total.balance), Math.abs(row.balance))
			}
		}),
		totalRow
	)

	// Get prefixers
	const reimbursementPrefixer = makePrefixerFunc(totalRow.maxes.rate);
	const totalPrefixer = makePrefixerFunc(totalRow.maxes.total);
	const balancePrefixer = makePrefixerFunc(totalRow.maxes.balance);

	// Instantiate table props
	const tableProps: TableProps<UtilizationTableRow> = {
		id: 'utilization-table',
		data: rows,
		rowKey: (row) => row.key,
		columns: [
			{
				name: '',
				cell: ({ row }) => (
					<th>
						<strong>{row.key === 'total' ? 'Total' : `${prettyAge(row.ageGroup)}`}</strong>
						{row.fundingTime && row.showFundingTime && (
							<> &ndash; {prettyFundingTime(row.fundingTime, { splitTimeText: 'pt/ft split' })}</>
						)}
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
					const { partWeeks, fullWeeks } = row.weeksSplit || {};
					return (
						<td className="text-tabular text-right">
							<ReimbursementRateLine
								prefix={reimbursementPrefixer(row.ptRate || 0)}
								prettyRate={currencyFormatter(row.ptRate || 0, true)}
								weeksInPeriod={partWeeks}
								suffix="(pt)"
							/>
							<ReimbursementRateLine
								prefix={reimbursementPrefixer(row.ftRate || 0)}
								prettyRate={currencyFormatter(row.ftRate || 0, true)}
								weeksInPeriod={fullWeeks}
								suffix="(ft)"
							/>
						</td>
					);
				},
			},
			{
				name: `Total (${getReportingPeriodWeeks(report.reportingPeriod)} weeks)`,
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
