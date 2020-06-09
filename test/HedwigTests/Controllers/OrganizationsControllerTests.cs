using Hedwig.Controllers;
using Hedwig.Repositories;
using Xunit;
using Moq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Models;


namespace HedwigTests.Controllers
{
	public class OrganizationsControllerTests
	{
		[Theory]
		[InlineData(true, typeof(OkObjectResult))]
		[InlineData(false, typeof(NotFoundResult))]
		public void Get_Id_Include_GetsOrganization_WithInclude(
			bool exists,
			Type resultType
		)
		{
			var id = 1;

			var returns = exists ? new Organization() : null;
			var _organizations = new Mock<IOrganizationRepository>();
			_organizations.Setup(o => o.GetOrganizationById(id))
			.Returns(returns);

			var controller = new OrganizationsController(_organizations.Object);

			var result = controller.Get(id);

			_organizations.Verify(o => o.GetOrganizationById(id), Times.Once());
			Assert.IsType(resultType, result.Result);
		}
	}
}
