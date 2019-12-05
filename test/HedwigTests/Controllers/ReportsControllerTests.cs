using Xunit;
using Moq;
using System.Threading.Tasks;
using Hedwig.Repositories;
using Hedwig.Controllers;

namespace HedwigTests.Controllers
{
    public class ReportsControllerTests
    {
        [Fact]
        public async Task Get_GetsReportsForOrganization()
        {
            var orgId = 1;
            var _reports = new Mock<IReportRepository>();

            var controller = new ReportsController(_reports.Object);

            await controller.Get(orgId);
            _reports.Verify(r => r.GetReportsForOrganization(orgId), Times.Once());
        }

    }
}