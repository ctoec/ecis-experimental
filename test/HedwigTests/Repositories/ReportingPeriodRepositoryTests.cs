using Xunit;
using System.Threading.Tasks;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Hedwig.Models;
using Hedwig.Repositories;

namespace HedwigTests.Repositories
{
  public class ReportingPeriodRepositoryTests
  {
    [Fact]
    public async Task GetReportingPeriodsByFundingSource_ReturnsReportingPeriods()
    {
      using (var context = new TestHedwigContextProvider().Context)
      {
        var cdcReportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, type: FundingSource.CDC);
        var otherReportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context, type: FundingSource.C4K);

        var reportingPeriodRepo = new ReportingPeriodRepository(context);
        var res = await reportingPeriodRepo.GetReportingPeriodsByFundingSourceAsync(FundingSource.CDC);

        Assert.True(res.FindAll(rp => rp.Type != FundingSource.CDC).Count == 0);
      }
    }
  }
}