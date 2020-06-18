using System.Collections.Generic;
using System.Security.Claims;
using Hedwig.Repositories;
using Hedwig.Security;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Moq;
using Xunit;

namespace HedwigTests.Security
{
	public class UserSiteAccessRequirementTests
	{
		[Fact]
		public void Site_Controller_User_Has_Site_Access_Evaluate_Returns_True()
		{
			using (var dbContext = new TestHedwigContextProvider().Context)
			{
				// If user exists with access to site
				var user = UserHelper.CreateUser(dbContext);
				var site = SiteHelper.CreateSite(dbContext);
				PermissionHelper.CreateSitePermission(dbContext, user, site);

				// When requirement is evaluated with:
				// - claim for that user
				var claim = new Claim("sub", $"{user.WingedKeysId}");
				var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] { claim }));

				// - httpContext for request to 'Sites' controller for that site
				var httpContext = new Mock<HttpContext>();
				var httpContextAccessor = new HttpContextAccessor
				{
					HttpContext = httpContext.Object
				};
				var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
					{"controller", "Sites"},
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
				Assert.True(authContext.HasSucceeded);
			}
		}
		[Fact]
		public void Other_Controller_User_Has_Site_Access_Evaluate_Returns_True()
		{
			using (var dbContext = new TestHedwigContextProvider().Context)
			{
				// If user exists with access to site
				var user = UserHelper.CreateUser(dbContext);
				var site = SiteHelper.CreateSite(dbContext);
				PermissionHelper.CreateSitePermission(dbContext, user, site);

				// When requirement is evaluated with:
				// - claim for that user
				var claim = new Claim("sub", $"{user.WingedKeysId}");
				var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] { claim }));

				// - httpContext for request to other controller nested under that site
				var httpContext = new Mock<HttpContext>();
				var httpContextAccessor = new HttpContextAccessor
				{
					HttpContext = httpContext.Object
				};
				var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
					{"controller", "Other"},
					{"siteId", $"{site.Id}"}
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
				Assert.True(authContext.HasSucceeded);
			}
		}

		[Fact]
		public void User_Does_Not_Have_Site_Access_Evaluate_Returns_False()
		{
			using (var dbContext = new TestHedwigContextProvider().Context)
			{
				// If user exists with out access to any site
				var user = UserHelper.CreateUser(dbContext);

				// When requirement is evaluated with:
				// - claim for that user
				var claim = new Claim("sub", $"{user.WingedKeysId}");
				var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] { claim }));

				// - httpContext for request to 'Sites' controller for any site
				var httpContext = new Mock<HttpContext>();
				var httpContextAccessor = new HttpContextAccessor
				{
					HttpContext = httpContext.Object
				};
				var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
					{"controller", "Site"},
					{"id", "1"}
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
				Assert.False(authContext.HasSucceeded);
			}
		}

	}
}
