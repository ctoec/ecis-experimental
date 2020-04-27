import React, { useState } from 'react';
import Table, { TableProps } from '../../../components/Table/Table';
import { CdcReport, Enrollment, Age, FundingSource, FundingTime, Region } from '../../../generated';
import idx from 'idx';
import moment from 'moment';
import { CdcRates } from './CdcRates';
import {
	prettyAge,
	prettyFundingTime,
	getFundingTime,
	getFundingSpaceCapacity,
} from '../../../utils/models';
import currencyFormatter from '../../../utils/currencyFormatter';
import cartesianProduct from '../../../utils/cartesianProduct';
import cx from 'classnames';

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

function getValueBeforeDecimalPoint(number: number) {
	const numAsString = number.toFixed(2);
	const decimalPointIndex = numAsString.indexOf('.');
	return numAsString.slice(0, decimalPointIndex).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getValueAfterDecimalPoint(number: number) {
	const numAsString = number.toFixed(2);
	const decimalPointIndex = numAsString.indexOf('.');
	return numAsString.slice(decimalPointIndex + 1);
}

export default function UtilizationTable(report: CdcReport) {
	const [maxLengthOfReimbursementRate, updateMaxLengthOfReimbursement] = useState(0);
	const [maxLengthOfTotalRate, updateMaxLengthOfTotalRate] = useState(0);

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
			// TODO: update funding space capacity method to account for splits
			const capacity = getFundingSpaceCapacity(report.organization, {
				source: FundingSource.CDC,
				ageGroup,
				time: fundingTime,
			});
			const count = countFundedEnrollments(enrollments, ageGroup, fundingTime);
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
				name: 'Reimbursement rate',
				cell: ({ row }) => {
					const valueBeforeDecimalPoint = getValueBeforeDecimalPoint(row.rate || 0);
					updateMaxLengthOfReimbursement(oldMaxLengthOfReimbursementRate => {
						return Math.max(valueBeforeDecimalPoint.length, oldMaxLengthOfReimbursementRate);
					});
					const numberOfLeadingZerosNeeded =
						maxLengthOfReimbursementRate - valueBeforeDecimalPoint.length;
					const leadingZeros =
						numberOfLeadingZerosNeeded >= 0 ? '0'.repeat(numberOfLeadingZerosNeeded) : '';
					return (
						<td className="text-tabular">
							{row.key !== 'total' && (
								<>
									<span>$ </span>
									<span style={{ visibility: 'hidden' }}>{leadingZeros}</span>
									{currencyFormatter(row.rate || 0, true)}
									<span> &times; {weeksInPeriod} weeks</span>
								</>
							)}
						</td>
					);
				},
			},
			{
				name: `Total (${weeksInPeriod} weeks)`,
				cell: ({ row }) => {
					const valueBeforeDecimalPoint = getValueBeforeDecimalPoint(row.total);
					updateMaxLengthOfTotalRate(oldMaxLengthOfTotalRate => {
						return Math.max(valueBeforeDecimalPoint.length, oldMaxLengthOfTotalRate);
					});
					const numberOfLeadingZerosNeeded = maxLengthOfTotalRate - valueBeforeDecimalPoint.length;
					const leadingZeros =
						numberOfLeadingZerosNeeded >= 0 ? '0'.repeat(numberOfLeadingZerosNeeded) : '';
					return (
						<td className={cx({ 'oec-table__cell--strong': row.key === 'total' }, 'text-tabular')}>
							<span>$ </span>
							<span style={{ visibility: 'hidden' }}>{leadingZeros}</span>
							{currencyFormatter(row.total, true)}
						</td>
					);
				},
			},
			{
				name: 'Balance',
				cell: ({ row }) => (
					<td
						className={cx(
							{ 'oec-table__cell--strong': row.key === 'total' },
							{ 'oec-table__cell--red': row.balance < 0 },
							'text-tabular'
						)}
					>
						<div className={cx('position-relative', { 'one-half-char-left': row.balance < 0 })}>
							{row.balance < 0 ? '(' : ''}
							{currencyFormatter(Math.abs(row.balance))}
							{row.balance < 0 ? ')' : ''}
						</div>
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
		r =>
			r.accredited === accredited &&
			r.titleI === titleI &&
			r.region === region &&
			r.ageGroup === ageGroup &&
			r.time === time
	);

	return rate ? rate.rate : 0;
}

export function countFundedEnrollments(
	enrollments: Enrollment[],
	ageGroup: Age,
	fundingTime: FundingTime
) {
	return enrollments.filter(enrollment => {
		if (enrollment.ageGroup !== ageGroup) {
			return false;
		}

		if (!enrollment.fundings) return false;

		const cdcFunding = enrollment.fundings.find(funding => funding.source === FundingSource.CDC);

		return getFundingTime(cdcFunding) === fundingTime;
	}).length;
}
