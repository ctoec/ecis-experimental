using Xunit;
using Hedwig.Models;
using Hedwig.Models.Extensions;

namespace HedwigTests.Models.Extensions
{
	public class FundingTimeSplitUtilizationExtensionsTests
	{
		[Theory]
		[InlineData(FundingTime.Full, 52, 0, 52)]
		[InlineData(FundingTime.Part, 52, 0, 0)]
		[InlineData(FundingTime.Full, 40, 12, 40)]
		[InlineData(FundingTime.Part, 30, 22, 22)]
		public void LesserWeeksUsed_ReturnsWeeksForFundingTime(
			FundingTime fundingTime,
			int fullTimeWeeksUsed,
			int partTimeWeeksUsed,
			int correctWeeksUsed
		)
		{
			var fundingTimeSplitUtilization = new FundingTimeSplitUtilization
			{
				FullTimeWeeksUsed = fullTimeWeeksUsed,
				PartTimeWeeksUsed = partTimeWeeksUsed
			};

			Assert.Equal(correctWeeksUsed, fundingTimeSplitUtilization.WeeksUsedForFundingTime(fundingTime));
		}
	}
}
