import React, { useState } from 'react';
import Table, { TableProps } from '../../../components/Table/Table';
import { CdcReport, Enrollment, Age, FundingTime, Region, FundingSpace } from '../../../generated';
import idx from 'idx';
import moment from 'moment';
import { CdcRates } from './CdcRates';
import {
	prettyAge,
	prettyFundingTime,
	isFundedForFundingSpace,
	fundingSpaceSorter,
} from '../../../utils/models';
import currencyFormatter from '../../../utils/currencyFormatter';
import cx from 'classnames';
import { DeepNonUndefineableArray } from '../../../utils/types';

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

function getNumberOfCommas(str: string) {
	return str.split(',').length - 1;
}

export default function UtilizationTable(report: CdcReport) {
	const [maxLengthOfReimbursementRate, updateMaxLengthOfReimbursement] = useState(0);
	const [numberOfCommasInReimbursement, updateNumberOfCommasInReimbursement] = useState(0);
	const [maxLengthOfTotalRate, updateMaxLengthOfTotalRate] = useState(0);
	const [numberOfCommasInTotalRate, updateNumberOfCommasInTotalRate] = useState(0);
	const [maxLengthOfBalance, updateMaxLengthOfBalance] = useState(0);
	const [numberOfCommasInBalance, updateNumberOfCommasInBalance] = useState(0);

	const site = idx(report, _ => _.organization.sites[0]);
	if (!site) {
		return <></>;
	}

	const fundingSpaces = idx(report, _ => _.organization.fundingSpaces);
	if (!fundingSpaces) {
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

	// NOTE: previously, looped over all possible combinations of age X time,
	// and then filtered for products with count or capacity > 0
	// UPDATED to loop over all existing fundingspaces, which will all have capacity > 0.
	// enrollments for funding spaces not in this list do not belong to this report.
	// Rows are sorted by fundingspace age, then time
	let rows: UtilizationTableRow[] = (fundingSpaces as DeepNonUndefineableArray<FundingSpace>)
		.sort(fundingSpaceSorter)
		.map(space => {
			const capacity = space.capacity;
			const ageGroup = space.ageGroup;
			const fundingTime = space.time;
			const count = countFundedEnrollments(enrollments, space.id);
			const rate = calculateRate(
				report.accredited,
				site.titleI,
				site.region,
				ageGroup,
				// Update this to handle FundingTime.Split
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
		});

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
				className: 'text-right',
				cell: ({ row }) => {
					const valueBeforeDecimalPoint = getValueBeforeDecimalPoint(row.rate || 0);
					const numberOfCommas = getNumberOfCommas(valueBeforeDecimalPoint);
					updateNumberOfCommasInReimbursement(oldNumberOfCommas => {
						return Math.max(numberOfCommas, oldNumberOfCommas);
					});
					updateMaxLengthOfReimbursement(oldMaxLengthOfReimbursementRate => {
						return Math.max(valueBeforeDecimalPoint.length, oldMaxLengthOfReimbursementRate);
					});
					const numberOfCommasNeeded = numberOfCommasInReimbursement - numberOfCommas;
					const numberOfLeadingZerosNeeded =
						maxLengthOfReimbursementRate - valueBeforeDecimalPoint.length - numberOfCommasNeeded;
					const leadingZeros =
						numberOfLeadingZerosNeeded >= 0 ? '0'.repeat(numberOfLeadingZerosNeeded) : '';
					const commas = numberOfCommasNeeded >= 0 ? ','.repeat(numberOfCommasNeeded) : '';
					const prefix = leadingZeros + commas;
					return (
						<td className="text-tabular text-right">
							{row.key !== 'total' && (
								<>
									<span>$ </span>
									<span style={{ visibility: 'hidden' }}>{prefix}</span>
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
				className: 'text-right',
				cell: ({ row }) => {
					const valueBeforeDecimalPoint = getValueBeforeDecimalPoint(row.total);
					const numberOfCommas = getNumberOfCommas(valueBeforeDecimalPoint);
					updateNumberOfCommasInTotalRate(oldNumberOfCommas => {
						return Math.max(numberOfCommas, oldNumberOfCommas);
					});
					updateMaxLengthOfTotalRate(oldMaxLengthOfTotalRate => {
						return Math.max(valueBeforeDecimalPoint.length, oldMaxLengthOfTotalRate);
					});
					const numberOfCommasNeeded = numberOfCommasInTotalRate - numberOfCommas;
					const numberOfLeadingZerosNeeded =
						maxLengthOfTotalRate - valueBeforeDecimalPoint.length - numberOfCommasNeeded;
					const leadingZeros =
						numberOfLeadingZerosNeeded >= 0 ? '0'.repeat(numberOfLeadingZerosNeeded) : '';
					const commas = numberOfCommasNeeded >= 0 ? ','.repeat(numberOfCommasNeeded) : '';
					const prefix = leadingZeros + commas;
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
					const valueBeforeDecimalPoint = getValueBeforeDecimalPoint(Math.abs(row.balance));
					const numberOfCommas = getNumberOfCommas(valueBeforeDecimalPoint);
					updateNumberOfCommasInBalance(oldNumberOfCommas => {
						return Math.max(numberOfCommas, oldNumberOfCommas);
					});
					updateMaxLengthOfBalance(oldMaxLengthOfBalance => {
						return Math.max(valueBeforeDecimalPoint.length, oldMaxLengthOfBalance);
					});
					const numberOfCommasNeeded = numberOfCommasInBalance - numberOfCommas;
					const numberOfLeadingZerosNeeded =
						maxLengthOfBalance - valueBeforeDecimalPoint.length - numberOfCommasNeeded;
					const leadingZeros =
						numberOfLeadingZerosNeeded >= 0 ? '0'.repeat(numberOfLeadingZerosNeeded) : '';
					const commas = numberOfCommasNeeded >= 0 ? ','.repeat(numberOfCommasNeeded) : '';
					const prefix = leadingZeros + commas;
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

export function countFundedEnrollments(enrollments: Enrollment[], fundingSpaceId: number) {
	return enrollments.filter(enrollment => {
		if (!enrollment.fundings) return false;
		return isFundedForFundingSpace(enrollment, fundingSpaceId);
	}).length;
}
