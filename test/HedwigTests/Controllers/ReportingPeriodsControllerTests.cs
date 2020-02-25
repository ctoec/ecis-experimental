using Xunit;
using Moq;
using System.Threading.Tasks;
using Hedwig.Repositories;
using Hedwig.Controllers;
using Hedwig.Models;

namespace HedwigTests.Controllers
{
	public class ReportingPeriodsControllerTests
	{
		[Fact]
		public async Task Get_Source_GetsReportingPeriodsBySource()
		{
			var _periods = new Mock<IReportingPeriodRepository>();

			var controller = new ReportingPeriodsController(_periods.Object);

			var source = FundingSource.CDC;
			await controller.Get(source);

			_periods.Verify(p => p.GetReportingPeriodsByFundingSourceAsync(source), Times.Once());
		}
	}
}
