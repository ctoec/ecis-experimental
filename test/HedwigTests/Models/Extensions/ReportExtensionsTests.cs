using System;
using System.Collections.Generic;
using Xunit;
using Hedwig.Models;
using Hedwig.Models.Extensions;

namespace HedwigTests.Models.Extensions
{
	public class ReportExtensionsTests
	{
		[Fact]
		public void GetWeeksUsedForFundingSpace_ReturnsZero_WhenNoPreviousUtilizations()
		{
			var fundingSpace = new FundingSpace {
				Id = 1,
				TimeSplit = new FundingTimeSplit {
					FundingSpaceId = 1,
					PartTimeWeeks = 10,
					FullTimeWeeks = 42,
				}
			};
			var reports = new List<CdcReport> {
				new CdcReport {
					SubmittedAt = new DateTime(),
					TimeSplitUtilizations = new List<FundingTimeSplitUtilization>()
				}
			};

			Assert.Equal(0, reports.GetWeeksUsedForFundingSpace(fundingSpace));
		}

		[Fact]
		public void GetWeeksUsedForFundingSpace_ReturnsZero_WhenReportsAreNotYetSubmitted()
		{
			var fundingSpace = new FundingSpace {
				Id = 1,
				TimeSplit = new FundingTimeSplit {
					FundingSpaceId = 1,
					PartTimeWeeks = 50,
					FullTimeWeeks = 2,
				}
			};
			var reports = new List<CdcReport>();
			foreach (var usage in new int[] { 3, 4, 5 })
			{
				reports.Add(
					new CdcReport {
						SubmittedAt = null,
						TimeSplitUtilizations = new List<FundingTimeSplitUtilization> {
							new FundingTimeSplitUtilization {
								FundingSpaceId = fundingSpace.Id,
								FundingSpace = fundingSpace,
								FullTimeWeeksUsed = usage,
								PartTimeWeeksUsed = 0
							}
						}
					}
				);
			}

			Assert.Equal(0, reports.GetWeeksUsedForFundingSpace(fundingSpace));
		}

		[Theory]
		[InlineData(50, 2, 0, new int[] {}, 0)]
		[InlineData(50, 2, 0, new int[] {1}, 1)]
		[InlineData(50, 2, 0, new int[] {5, 8, 10, 1}, 24)]
		[InlineData(50, 2, 6, new int[] {}, 0)]
		[InlineData(50, 2, 10, new int[] {1}, 1)]
		[InlineData(50, 2, 40, new int[] {5, 8, 10, 1}, 24)]
		[InlineData(2, 50, 0, new int[] {}, 0)]
		[InlineData(2, 50, 0, new int[] {1}, 0)]
		[InlineData(2, 50, 0, new int[] {5, 8, 10, 1}, 0)]
		[InlineData(2, 50, 6, new int[] {}, 0)]
		[InlineData(2, 50, 10, new int[] {1}, 10)]
		[InlineData(2, 50, 40, new int[] {5, 8, 10, 1}, 160)]
		public void GetWeeksUsedForFundingSpace_ReturnsSumOfLesserWeeksUsed(
			int partTimeWeeks,
			int fullTimeWeeks,
			int largerTimeUsage,
			int[] weeksUsed,
			int sum
		)
		{
			var fundingSpace = new FundingSpace {
				Id = 1,
				TimeSplit = new FundingTimeSplit {
					FundingSpaceId = 1,
					PartTimeWeeks = partTimeWeeks,
					FullTimeWeeks = fullTimeWeeks,
				}
			};
			var reports = new List<CdcReport>();
			foreach (var usage in weeksUsed)
			{
				reports.Add(
					new CdcReport {
						SubmittedAt = new DateTime(),
						TimeSplitUtilizations = new List<FundingTimeSplitUtilization> {
							new FundingTimeSplitUtilization {
								FundingSpaceId = fundingSpace.Id,
								FundingSpace = fundingSpace,
								FullTimeWeeksUsed = usage,
								PartTimeWeeksUsed = largerTimeUsage
							}
						}
					}
				);
			}

			Assert.Equal(sum, reports.GetWeeksUsedForFundingSpace(fundingSpace));
		}
	}
}