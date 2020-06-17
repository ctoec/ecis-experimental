using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Hedwig.Controllers;
using Hedwig.Repositories;
using Hedwig.Models;

namespace HedwigTests.Controllers
{
	public class SitesControllerTests
	{
		[Fact]
		public async Task Get_GetsSitesForOrganization()
		{
			var _sites = new Mock<ISiteRepository>();
			var controller = new SitesController(_sites.Object);

			var orgId = 1;
			await controller.Get(orgId);

			_sites.Verify(s => s.GetEnrollmentSummarySiteDTOsForOrganizationAsync(orgId), Times.Once());
		}

		[Theory]
		[InlineData(true, typeof(OkObjectResult))]
		[InlineData(false, typeof(NotFoundResult))]
		public async Task Get_Id_Include_GetsSite_WithInclude(
			bool exists,
			Type resultType
		)
		{
			var id = 1;
			var orgId = 1;

			var returns = exists ? new Site() : null;
			var _sites = new Mock<ISiteRepository>();
			_sites.Setup(s => s.GetSiteForOrganizationAsync(id, orgId))
				.ReturnsAsync(returns);

			var controller = new SitesController(_sites.Object);

			var result = await controller.Get(id, orgId);

			_sites.Verify(s => s.GetSiteForOrganizationAsync(id, orgId));
			Assert.IsType(resultType, result.Result);

		}
	}
}
