import {
	FundingTimeSplitUtilization,
	FundingTime,
	FundingTimeSplit,
	ReportingPeriod,
	CdcReport,
	FundingSpace,
} from '../../generated';
import { DeepNonUndefineable } from '../types';

export function sumWeeksUsed(utils: FundingTimeSplitUtilization[], lesserTime: FundingTime) {
	return utils.reduce((acc, util) => {
		switch (lesserTime) {
			case FundingTime.Full:
				return acc + util.fullTimeWeeksUsed;
			case FundingTime.Part:
				return acc + util.partTimeWeeksUsed;
			default:
				throw new Error('Something impossible happened');
		}
	}, 0);
}

export const getSplitUtilizations = (
	report: CdcReport,
	splitTimeFundingSpaces: FundingSpace[],
	reportingPeriodWeeks: number
) => {
	return report.timeSplitUtilizations && report.timeSplitUtilizations.length
		? report.timeSplitUtilizations
		: splitTimeFundingSpaces.map((fundingSpace) =>
				getSplitUtilization(
					fundingSpace.timeSplit as FundingTimeSplit,
					0,
					reportingPeriodWeeks,
					report.reportingPeriod as ReportingPeriod,
					report
				)
		  );
};

export const getSplitUtilization = (
	timeSplit: FundingTimeSplit,
	lesserWeeksUsed: number,
	reportingPeriodWeeks: number,
	reportingPeriod: ReportingPeriod,
	report: CdcReport
): FundingTimeSplitUtilization => {
	const lesserTime =
		timeSplit.fullTimeWeeks < timeSplit.partTimeWeeks ? FundingTime.Full : FundingTime.Part;
	const greaterWeeksUsed = reportingPeriodWeeks - lesserWeeksUsed;
	return {
		id: timeSplit.id,
		fundingSpaceId: timeSplit.fundingSpaceId,
		reportingPeriodId: reportingPeriod.id,
		reportId: report.id,
		fullTimeWeeksUsed: lesserTime === FundingTime.Full ? lesserWeeksUsed : greaterWeeksUsed,
		partTimeWeeksUsed: lesserTime === FundingTime.Full ? greaterWeeksUsed : lesserWeeksUsed,
	};
};
