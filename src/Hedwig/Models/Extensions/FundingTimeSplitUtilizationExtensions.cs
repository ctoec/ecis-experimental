namespace Hedwig.Models.Extensions
{
	public static class FundingTimeSplitUtilizationsExtensions
	{
		public static int WeeksUsedForFundingTime(this FundingTimeSplitUtilization fundingTimeSplitUtilization, FundingTime fundingTime)
		{
			return fundingTime == FundingTime.Full ?
				fundingTimeSplitUtilization.FullTimeWeeksUsed :
				fundingTimeSplitUtilization.PartTimeWeeksUsed;
		}
	}
}
