using Moq;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace HedwigTests.Fixtures
{
    public class TestHttpContextAccessorProvider
    {
        public IHttpContextAccessor HttpContextAccessor { get; private set; }
        public static int USER_CONTEXT_SUB = 1;
        public TestHttpContextAccessorProvider() {
        	var mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
			var httpContext = new DefaultHttpContext();
			var mockClaimsPrincipal = new Mock<ClaimsPrincipal>();
            var mockClaim = new Mock<Claim>("sub", $"{USER_CONTEXT_SUB}");
			mockClaimsPrincipal.Setup(mcp => mcp.FindFirst("sub")).Returns(mockClaim.Object);
            httpContext.User = mockClaimsPrincipal.Object;
			mockHttpContextAccessor.Setup(mhca => mhca.HttpContext).Returns(httpContext);

            HttpContextAccessor = mockHttpContextAccessor.Object;
        }
    }
}
