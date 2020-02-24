using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Repositories;
using Hedwig.Controllers;

namespace HedwigTests.Controllers
{
  public class UsersControllerTests
  {
	[Fact]
	public async Task Get_Current_GetsUserByWingedKeysId_FromSecurityPrincipalSubClaim()
	{
	  var _users = new Mock<IUserRepository>();

	  var id = Guid.NewGuid();
	  var claim = new Claim("sub", id.ToString());
	  var user = new Mock<ClaimsPrincipal>();
	  user.Setup(u => u.FindFirst("sub")).Returns(claim);
	  var httpContext = new Mock<HttpContext>();
	  httpContext.Setup(h => h.User).Returns(user.Object);
	  var controllerContext = new ControllerContext
	  {
		HttpContext = httpContext.Object
	  };

	  var controller = new UsersController(_users.Object);
	  controller.ControllerContext = controllerContext;

	  await controller.GetCurrent();
	  _users.Verify(u => u.GetUserByWingedKeysIdAsync(id));
	}
  }
}
