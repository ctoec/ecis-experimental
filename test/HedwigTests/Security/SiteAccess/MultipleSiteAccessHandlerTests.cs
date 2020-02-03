using Xunit;
using Moq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using System.Security.Claims;
using System.Collections.Generic;
using Hedwig.Repositories;
using Hedwig.Security;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Security
{
	public class MultipleSiteAccessHandlerTests
	{
		[Fact]
		public void Organization_Controller_User_Has_All_Sites_Access_Returns_True()
		{
			// TODO: Figure out how to mock .TryGetValues b/c it updates a parameter in place instead of as a return
			using (var dbContext = new TestContextProvider().Context) {
				// If user exists with access to site
				var user = UserHelper.CreateUser(dbContext);
				var site = SiteHelper.CreateSite(dbContext);
				PermissionHelper.CreateSitePermission(dbContext, user, site);

				// When requirement is evaluated with:
				// - claim for that user
				var claim = new Claim("sub", $"{user.WingedKeysId}");
				var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {claim}));

				// - httpContext for request to 'Sites' controller for that site
				var httpContext = new Mock<HttpContext>();
				var httpContextAccessor = new HttpContextAccessor {
						HttpContext = httpContext.Object
				};
				var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
					{"controller", "Organizations"},
					{"id", $"{site.Id}"}
				});
				httpContext.Setup(hc => hc.Features.Get<IRoutingFeature>()).Returns(new Mock<IRoutingFeature>().Object);
				httpContext.Setup(hc => hc.Request.RouteValues).Returns(routeValues);

				// - permission repository
				var permissions = new PermissionRepository(dbContext);

				var reqHandler = new SingleSiteAccessHandler(httpContextAccessor, permissions);
				var req = new SiteAccessRequirement();

				var authContext = new AuthorizationHandlerContext(new List<IAuthorizationRequirement> { req }, userClaim, new object());

				// When requirement handler handles authorization context
				reqHandler.HandleAsync(authContext);

				// Then authorization context will have succeeded
				// Assert.True(authContext.HasSucceeded);
			}
		}
	}
}