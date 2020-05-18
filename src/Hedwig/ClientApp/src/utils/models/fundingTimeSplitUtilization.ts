import { FundingTimeSplitUtilization, FundingTime } from "../../generated";

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