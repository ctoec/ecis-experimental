using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Moq;
using Xunit;
using Hedwig.Repositories;
using Hedwig.Security;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Security
{
	public class MultipleSiteAccessHandlerTests
	{
		[Theory]
		[InlineData(true, true)]
		[InlineData(false, false)]
		public void OrganizationController_ReturnsCorrectResult_WhenUserHasVariousSiteAccess(
			bool hasAccessToSite2,
			bool authSucceeds
		)
		{
			using (var dbContext = new TestHedwigContextProvider().Context)
			{
				// If user exists with access to site
				var user = UserHelper.CreateUser(dbContext);
				var site1 = SiteHelper.CreateSite(dbContext, name: "Test 1");
				var site2 = SiteHelper.CreateSite(dbContext, name: "Test 2");
				PermissionHelper.CreateSitePermission(dbContext, user, site1);
				if (hasAccessToSite2)
				{
					PermissionHelper.CreateSitePermission(dbContext, user, site2);
				}

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

				var siteIds = new StringValues(new string[] { site1.Id.ToString(), site2.Id.ToString() });
				httpContext.Setup(hc => hc.Request.Query.TryGetValue(It.IsAny<string>(), out siteIds)).Returns(true);
				// - permission repository
				var permissions = new PermissionRepository(dbContext);

				var reqHandler = new MultipleSiteAccessHandler(httpContextAccessor, permissions);
				var req = new SiteAccessRequirement();

				var authContext = new AuthorizationHandlerContext(new List<IAuthorizationRequirement> { req }, userClaim, new object());

				// When requirement handler handles authorization context
				reqHandler.HandleAsync(authContext);

				// Then authorization context will have succeeded
				Assert.Equal(authSucceeds, authContext.HasSucceeded);
			}
		}
	}
}
