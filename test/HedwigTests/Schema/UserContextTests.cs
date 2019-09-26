using Xunit;
using Hedwig.Schema;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Moq;

namespace HedwigTests.Schema
{
    public class UserContextTests
    {
        [Fact]
        public void Has_GlobalArguments_Dict()
        {
            var userContext = new UserContext();
            Assert.IsType<Dictionary<string, object>>(userContext.GlobalArguments);
        }

        [Fact]
        public void UserContextCreator_Returns_New_UserContext()
        {
            var httpContextMock = new Mock<HttpContext>();
            var userContext = UserContext.UserContextCreator(httpContextMock.Object);
            Assert.IsType<UserContext>(userContext);
        }
    }
}