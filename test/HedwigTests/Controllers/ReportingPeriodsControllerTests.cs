using Hedwig.Controllers;
using Hedwig.Models;
using Hedwig.Repositories;
using Moq;
using Xunit;

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
