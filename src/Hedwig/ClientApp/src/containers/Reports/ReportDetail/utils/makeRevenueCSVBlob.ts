import { parse as parseCsv } from 'json2csv';
import { CdcReport, FundingTime } from "../../../../generated";
import { prettyAge, prettyFundingTime, getReportingPeriodWeeks } from "../../../../utils/models";
import { getRevenueDataRows } from "./getRevenueDataRows";

export const makeRevenueCSVBlob = (report: CdcReport) => {
	let revenueData = getRevenueDataRows(report);
	const totalRow = revenueData.find((row) => row.key === 'total');

	const revenueCSVRows: any[] = revenueData.map((row) => ({
		...row,
		title:
			row.key === 'total'
				? 'Total'
				: `${prettyAge(row.ageGroup)} - ${prettyFundingTime(row.fundingTime)}`,
	}));

	revenueCSVRows.push(
		{}, // empty row for final CSV formatting
		{ title: 'Other revenue' },
		{}, // empty row for final CSV formatting
		{ title: 'Care 4 Kids', total: report.c4KRevenue },
		{ title: 'Family Fees', total: report.familyFeesRevenue },
		{}, // empty row for final CSV formatting
		{
			title: 'Total revenue',
			total: (totalRow?.total || 0) + (report.c4KRevenue || 0) + (report.familyFeesRevenue || 0),
		}
	);

	const fields = [
		{
			label: 'CDC Revenue',
			value: 'title',
		},
		{
			label: 'Utilization',
			value: (row: any) =>
				row.count != undefined && row.capacity != undefined ? `${row.count} / ${row.capacity}` : '',
		},
		{
			label: 'Reimbursement rate',
			value: (row: any) => {
				let rateStr = '';
				if (row.ptRate != undefined && row.fundingTime && row.fundingTime !== FundingTime.Full)
					rateStr += `${row.ptRate} (part-time) `;
				if (row.ftRate != undefined && row.fundingTime && row.fundingTime !== FundingTime.Part)
					rateStr += `${row.ftRate} (full-time) `;
				return rateStr;
			},
		},
		{
			label: `Total (${getReportingPeriodWeeks(report.reportingPeriod)} weeks)`,
			value: 'total',
		},
		{
			label: 'Balance',
			value: (row: any) => (row.balance != undefined ? (row.balance as number).toFixed(2) : ''),
		},
	];

	const revenueCsv = parseCsv(revenueCSVRows, { fields });
	return new Blob([revenueCsv], { type: 'text/csv' });
};
