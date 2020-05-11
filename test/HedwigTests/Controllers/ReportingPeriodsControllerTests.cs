using Xunit;
using Moq;
using Hedwig.Repositories;
using Hedwig.Controllers;
using Hedwig.Models;

namespace HedwigTests.Controllers
{
	public class ReportingPeriodsControllerTests
	{
		[Fact]
		public void Get_Source_GetsReportingPeriodsBySource()
		{
			var _periods = new Mock<IReportingPeriodRepository>();

			var controller = new ReportingPeriodsController(_periods.Object);

			var source = FundingSource.CDC;
			controller.Get(source);

			_periods.Verify(p => p.GetReportingPeriodsByFundingSource(source), Times.Once());
		}
	}
}
