using Moq;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;

namespace HedwigTests.Fixtures
{
  public class TestHttpContextAccessorProvider
  {
    public IHttpContextAccessor HttpContextAccessor { get; private set; }
    public static Guid USER_CONTEXT_SUB = Guid.Parse("2c0ec653-8829-4aa1-82ba-37c8832bbb88");
    public TestHttpContextAccessorProvider()
    {
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
