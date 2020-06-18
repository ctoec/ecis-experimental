using Hedwig.Models;
using Hedwig.Models.Extensions;
using Xunit;

namespace HedwigTests.Models.Extensions
{
	public class FundingTimeSplitExtensionsTests
	{
		[Theory]
		[InlineData(0, 52, 0)]
		[InlineData(10, 42, 10)]
		[InlineData(30, 22, 22)]
		[InlineData(26, 26, 26)]
		public void LesserTimeWeeksAvailable_ReturnsLesserWeeks(
			int fullTimeWeeks,
			int partTimeWeeks,
			int lesserWeeks
		)
		{
			var fundingTimeSplit = new FundingTimeSplit
			{
				FullTimeWeeks = fullTimeWeeks,
				PartTimeWeeks = partTimeWeeks
			};

			Assert.Equal(lesserWeeks, fundingTimeSplit.LesserTimeWeeksAvailable());
		}

		[Theory]
		[InlineData(0, 52, FundingTime.Full)]
		[InlineData(10, 42, FundingTime.Full)]
		[InlineData(30, 22, FundingTime.Part)]
		// Tie breakers default to Part
		[InlineData(26, 26, FundingTime.Part)]
		public void LesserTime_ReturnsFundingTimeForLesserWeeks(
			int fullTimeWeeks,
			int partTimeWeeks,
			FundingTime fundingTime
		)
		{
			var fundingTimeSplit = new FundingTimeSplit
			{
				FullTimeWeeks = fullTimeWeeks,
				PartTimeWeeks = partTimeWeeks
			};

			Assert.Equal(fundingTime, fundingTimeSplit.LesserTime());
		}
	}
}
