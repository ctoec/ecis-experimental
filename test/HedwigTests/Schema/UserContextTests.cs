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
            var httpCtx = new Mock<HttpContext>();
            var userContext= new RequestContext(httpCtx.Object.User);
            Assert.IsType<Dictionary<string, object>>(userContext.GlobalArguments);
        }

        [Fact]
        public void UserContextCreator_Returns_New_UserContext()
        {
            var httpContextMock = new Mock<HttpContext>();
            var userContext = RequestContext.RequestContextCreator(httpContextMock.Object);
            Assert.IsType<RequestContext>(userContext);
        }
    }
}