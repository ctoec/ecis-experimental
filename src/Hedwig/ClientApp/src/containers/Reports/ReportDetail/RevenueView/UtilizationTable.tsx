import React from 'react';
import Table, { TableProps } from '../../../../components/Table/Table';
import {
	CdcReport,
	Enrollment,
	Age,
	FundingTime,
	FundingSpace,
	FundingSource,
} from '../../../../generated';
import idx from 'idx';
import moment from 'moment';
import {
	prettyAge,
	prettyFundingTime,
	fundingSpaceSorter,
	getReportingPeriodWeeks,
	getFundingSpaces,
} from '../../../../utils/models';
import currencyFormatter from '../../../../utils/currencyFormatter';
import cx from 'classnames';
import { DeepNonUndefineableArray } from '../../../../utils/types';
import {
	countFundedEnrollments,
	calculateRate,
	makePrefixerFunc,
	ReimbursementRateLine,
	productOfUnknowns,
} from '../../../../utils/utilizationTable';
import FormContext, { useGenericContext } from '../../../../components/Form_New/FormContext';
import { getSplitUtilizations } from '../../../../utils/models/fundingTimeSplitUtilization';

interface UtilizationTableRow {
	key: string;
	ageGroup?: Age;
	fundingTime?: FundingTime;
	count: number;
	capacity: number;
	ftRate?: number;
	ptRate?: number;
	total: number;
	balance: number;
	showFundingTime?: boolean;
	weeksSplit?: {
		partWeeks: number | undefined;
		fullWeeks: number | undefined;
	};
	maxes: {
		// These are needed to format the numbers for alignment
		total: number;
		rate: number;
		balance: number;
	};
}

// Not functional component because ts had a problem with the empty fragments
export default function UtilizationTable() {
	const { data: report } = useGenericContext<CdcReport>(FormContext);

	const rows = getUtilizationTableRows(report);
	const totalRow = rows[rows.length - 1];

	const reimbursementPrefixer = makePrefixerFunc(totalRow.maxes.rate);
	const totalPrefixer = makePrefixerFunc(totalRow.maxes.total);
	const balancePrefixer = makePrefixerFunc(totalRow.maxes.balance);

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

export const getUtilizationTableRows = (report: CdcReport) => {
	// TODO: if the space lives on the organization but the rates live on the site,
	// we need to reconsider how we handle multi site org rate calculation
	const site = idx(report, (_) => _.organization.sites[0]);
	const fundingSpaces = idx(report, (_) => _.organization.fundingSpaces);

	if (!site || !fundingSpaces) return [];

	const weeksInPeriod = getReportingPeriodWeeks(report.reportingPeriod);
	const splitTimeFundingSpaces = getFundingSpaces(
		report.organization && report.organization.fundingSpaces,
		{
			time: FundingTime.Split,
		}
	);
	const timeSplitUtilizations = getSplitUtilizations(report, splitTimeFundingSpaces, weeksInPeriod);

	const enrollments = (idx(report, (_) => _.enrollments) || []) as Enrollment[];

	const cdcFundingSpaces = (fundingSpaces as DeepNonUndefineableArray<FundingSpace>)
		.sort(fundingSpaceSorter)
		.filter((fundingSpace) => fundingSpace.source === FundingSource.CDC);

	let rows: UtilizationTableRow[] = cdcFundingSpaces.map((space) => {
		const capacity = space.capacity;
		const ageGroup = space.ageGroup;
		const fundingTime = space.time;
		const count = countFundedEnrollments(enrollments, space.id);
		const ptRate = calculateRate(
			report.accredited,
			site.titleI,
			site.region,
			ageGroup,
			FundingTime.Part
		);
		const ftRate = calculateRate(
			report.accredited,
			site.titleI,
			site.region,
			ageGroup,
			FundingTime.Full
		);

		let fullWeeks: number | undefined, partWeeks: number | undefined;
		if (fundingTime === FundingTime.Split) {
			const thisUtilization = (timeSplitUtilizations || []).find((u) => u.reportId === report.id);
			fullWeeks = 0;
			partWeeks = 0;
			if (thisUtilization) {
				fullWeeks = thisUtilization.fullTimeWeeksUsed || 0;
				partWeeks = thisUtilization.partTimeWeeksUsed || 0;
			}
		} else if (fundingTime === FundingTime.Full) {
			fullWeeks = weeksInPeriod;
		} else if (fundingTime === FundingTime.Part) {
			partWeeks = weeksInPeriod;
		}

		const cappedCount = Math.min(count, capacity);
		const total =
			productOfUnknowns([cappedCount, fullWeeks, ftRate]) +
			productOfUnknowns([cappedCount, partWeeks, ptRate]);
		const paid =
			productOfUnknowns([capacity, fullWeeks, ftRate]) +
			productOfUnknowns([capacity, partWeeks, ptRate]);

		const balance = total - paid;

		return {
			key: `${ageGroup}-${fundingTime}`,
			ageGroup,
			fundingTime,
			count,
			capacity,
			ftRate,
			ptRate,
			total,
			balance,
			showFundingTime: cdcFundingSpaces.filter((fs) => fs.ageGroup === ageGroup).length > 1,
			weeksSplit: {
				partWeeks: partWeeks,
				fullWeeks: fullWeeks,
			},
			maxes: {
				total,
				rate: Math.max(ptRate, ftRate),
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
					rate: Math.max(total.maxes.rate, row.ftRate || 0, row.ptRate || 0),
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

	return rows;
};
