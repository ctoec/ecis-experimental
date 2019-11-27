using Xunit;
using Moq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Hedwig.Controllers;
using Hedwig.Repositories;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace HedwigTests.Controllers
{
    public class UsersControllerTests
    {
        [Fact]
        public async Task Get_CurentUser()
        {
            var userId = "123";
            var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
            {
                new Claim("sub", userId)
            }, "mock"));

            var _users = new Mock<IUserRepository>();

            var controller = new UsersController(_users.Object);
            controller.ControllerContext = new ControllerContext()
            {
                HttpContext = new DefaultHttpContext() { User = user }
            };

            await controller.GetCurrent();
            _users.Verify(c => c.GetUserByIdAsync(123), Times.Once());
        }
    }
}