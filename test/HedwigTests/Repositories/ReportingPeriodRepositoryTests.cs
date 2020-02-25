using Xunit;
using System.Threading.Tasks;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Hedwig.Models;
using Hedwig.Repositories;
using System;

namespace HedwigTests.Repositories
{
	public class ReportingPeriodRepositoryTests
	{
		// [Fact]
		// public async Task GetReportingPeriodsByFundingSource_ReturnsReportingPeriods()
		// {
		//   using (var context = new TestHedwigContextProvider().Context)
		//   {
		//     var cdcReportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, type: FundingSource.CDC);
		//     var otherReportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, type: FundingSource.C4K);

		//     var reportingPeriodRepo = new ReportingPeriodRepository(context);
		//     var res = await reportingPeriodRepo.GetReportingPeriodsByFundingSourceAsync(FundingSource.CDC);

		//     Assert.True(res.FindAll(rp => rp.Type != FundingSource.CDC).Count == 0);
		//   }
		// }

		[Theory]
		[InlineData("lastReportingPeriodPeriodEnd")]
		[InlineData("nextReportingPeriodPeriodStart")]
		[InlineData("nextReportingPeriodAnyDate")]
		public void GetLastReportingPeriodBeforeDate_ReturnsMostRecentlyEndedReportingPeriod(
			string compareDateType
		)
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var lastReportingPeriod = ReportingPeriodHelper.GetOrCreateReportingPeriodForPeriod(context, type: FundingSource.CDC, period: "2010-10-01", periodStart: "2010-10-01", periodEnd: "2010-10-31");
				// older reporting period
				ReportingPeriodHelper.GetOrCreateReportingPeriodForPeriod(context, type: FundingSource.CDC, period: "2010-09-01", periodStart: "2010-09-02", periodEnd: "2010-09-30");
				// next reporting period
				var nextReportingPeriod = ReportingPeriodHelper.GetOrCreateReportingPeriodForPeriod(context, type: FundingSource.CDC, period: "2010-11-01", periodStart: "2010-11-01", periodEnd: "2010-11-30");

				var reportingPeriodRepo = new ReportingPeriodRepository(context);
				var compareDate = compareDateType == "lastReportingPeriodPeriodEnd"
					? lastReportingPeriod.PeriodEnd
					: compareDateType == "nextReportingPeriodPeriodStart"
					? nextReportingPeriod.PeriodStart
					: nextReportingPeriod.PeriodStart.AddDays(10);

				var res = reportingPeriodRepo.GetLastReportingPeriodBeforeDate(FundingSource.CDC, compareDate);

				Assert.Equal(lastReportingPeriod.Id, res.Id);
			}
		}
	}
}
