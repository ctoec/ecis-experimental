using System;
using Hedwig.Models;
using Hedwig.Models.Extensions;
using Xunit;

namespace HedwigTests.Models.Extensions
{
	public class ReportingPeriodExtensionsTests
	{
		[Theory]
		[InlineData(2010, 1, 1, 2010, 1, 8, 1)]
		[InlineData(2010, 1, 1, 2010, 1, 15, 2)]
		[InlineData(2010, 1, 1, 2010, 1, 17, 3)]
		[InlineData(2010, 1, 1, 2010, 1, 22, 3)]
		[InlineData(2010, 1, 1, 2010, 1, 29, 4)]
		[InlineData(2010, 1, 1, 2010, 1, 31, 5)]
		[InlineData(2010, 1, 1, 2010, 2, 5, 5)]
		[InlineData(2010, 3, 15, 2010, 3, 31, 3)]
		[InlineData(2010, 3, 15, 2010, 4, 15, 5)]
		[InlineData(2010, 2, 1, 2010, 2, 28, 4)]
		[InlineData(2020, 2, 1, 2020, 2, 29, 4)]
		[InlineData(2020, 2, 1, 2020, 3, 1, 5)]
		public void NumberOfWeeks_ReturnNumberOfDaysInReportingPeriodDividedBySevenRoundedUp(
			int startYear,
			int startMonth,
			int startDay,
			int endYear,
			int endMonth,
			int endDay,
			int numberOfWeeks
		)
		{
			var reportingPeriod = new ReportingPeriod
			{
				PeriodStart = new DateTime(startYear, startMonth, startDay),
				PeriodEnd = new DateTime(endYear, endMonth, endDay),
			};

			Assert.Equal(numberOfWeeks, reportingPeriod.NumberOfWeeks());
		}
	}
}
