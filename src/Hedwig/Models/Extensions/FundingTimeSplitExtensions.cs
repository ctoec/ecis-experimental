using System;

namespace Hedwig.Models.Extensions
{
	public static class FundingTimeSplitExtensions
	{
		public static int LesserTimeWeeksAvailable(this FundingTimeSplit fundingTimeSplit)
		{
			return Math.Min(
				fundingTimeSplit.FullTimeWeeks,
				fundingTimeSplit.PartTimeWeeks
			);
		}

		public static FundingTime LesserTime(this FundingTimeSplit fundingTimeSplit)
		{
			return fundingTimeSplit.FullTimeWeeks < fundingTimeSplit.PartTimeWeeks ?
				FundingTime.Full :
				FundingTime.Part;
		}
	}
}
