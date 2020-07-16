import { CdcReport, FundingTime, Enrollment, FundingSpace, FundingSource, Age } from "../../../../generated";
import idx from "idx";
import { getReportingPeriodWeeks, getFundingSpaces, fundingSpaceSorter } from "../../../../utils/models";
import { getSplitUtilizations } from "../../../../utils/models/fundingTimeSplitUtilization";
import { DeepNonUndefineableArray } from "../../../../utils/types";
import { countFundedEnrollments, calculateRate, productOfUnknowns } from "../../../../utils/utilizationTable";

export interface RevenueDataRow  {
	key: string;
	ageGroup?: Age;
	fundingTime?: FundingTime;
	count: number;
	capacity: number;
	ftRate?: number;
	ptRate?: number;
	total: number;
	balance: number;
	weeksSplit?: {
		partWeeks: number | undefined;
		fullWeeks: number | undefined;
	};
}
export const getRevenueDataRows = (report: CdcReport) => {
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

	let rows: RevenueDataRow[] = cdcFundingSpaces.map((space) => {
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
			weeksSplit: {
				partWeeks: partWeeks,
				fullWeeks: fullWeeks,
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
			};
		},
		{
			key: 'total',
			count: 0,
			capacity: 0,
			total: 0,
			balance: 0,
		}
	);

	rows.push(totalRow);

	return rows;
};
