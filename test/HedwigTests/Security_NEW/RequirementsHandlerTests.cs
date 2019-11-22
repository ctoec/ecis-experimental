using Xunit;
using Moq;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Hedwig.Repositories;
using Hedwig.Security_NEW;

namespace HedwigTests.Security_NEW
{
    public class RequirementsHandlerTests
    {
        [Fact]
        public void When_IPermissionRequirement_Evaluates_True_Succeeds()
        {
            // If requirement handler exists
            var user = new Mock<ClaimsPrincipal>();
            var httpContext = new Mock<HttpContext>();
            var permissions = new Mock<IPermissionRepository>();
            var httpContextAccessor = new Mock<IHttpContextAccessor>();
            httpContextAccessor.Setup(hca => hca.HttpContext)
                .Returns(httpContext.Object);

            var reqHandler = new RequirementsHandler(httpContextAccessor.Object, permissions.Object);

            // and authorization context exists with permission requirement that evaluates to true
            var req = new Mock<IPermissionRequirement>();
            req.Setup(r => r.Evaluate(user.Object, httpContext.Object, permissions.Object))
                .Returns(true);
            var authContext = new AuthorizationHandlerContext(new List<IAuthorizationRequirement> { req.Object }, user.Object, new object());

            // When requirement handler handles authorization context
            reqHandler.HandleAsync(authContext);

            // Then authorization context will have succeeded
            Assert.True(authContext.HasSucceeded);
        }

        [Fact]
        public void When_IPermissionRequirement_Evaluates_False_Does_Not_Succeed()
        {
            // If requirement handler exists
            var user = new Mock<ClaimsPrincipal>();
            var httpContext = new Mock<HttpContext>();
            var permissions = new Mock<IPermissionRepository>();
            var httpContextAccessor = new Mock<IHttpContextAccessor>();
            httpContextAccessor.Setup(hca => hca.HttpContext)
                .Returns(httpContext.Object);

            var reqHandler = new RequirementsHandler(httpContextAccessor.Object, permissions.Object);

            // and authorization context exists with permission requirement that evaluates to false
            var req = new Mock<IPermissionRequirement>();
            req.Setup(r => r.Evaluate(user.Object, httpContext.Object, permissions.Object))
                .Returns(false);
            var authContext = new AuthorizationHandlerContext(new List<IAuthorizationRequirement> { req.Object }, user.Object, new object());

            // When requirement handler handles authorization context
            reqHandler.HandleAsync(authContext);

            // Then authorization context will not have succeeded
            Assert.False(authContext.HasSucceeded);
        }
    }
}