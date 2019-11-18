using Xunit;
using Moq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using System.Security.Claims;
using System.Collections.Generic;
using Hedwig.Repositories;
using Hedwig.Models;
using Hedwig.Security_NEW;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Security_NEW
{
    public class UserSiteAccessRequirementTests
    {
        [Fact]
        public void Site_Controller_User_Has_Site_Access_Evaluate_Returns_True()
        {
            using (var dbContext = new TestContextProvider().Context) {
                // If user exists with access to site
                var user = UserHelper.CreateUser(dbContext);
                var site = SiteHelper.CreateSite(dbContext);
                PermissionHelper.CreateSitePermission(dbContext, user, site);

                // When requirement is evaluated with:
                // - claim for that user
                var claim = new Claim("sub", $"{user.Id}");
                var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {claim}));

                // - httpContext for request to 'Sites' controller for that site
                var httpContext = new Mock<HttpContext>();
                var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
                    {"controller", "Sites"},
                    {"id", $"{site.Id}"}
                });
                httpContext.Setup(hc => hc.Features.Get<IRoutingFeature>()).Returns(new Mock<IRoutingFeature>().Object);
                httpContext.Setup(hc => hc.Request.RouteValues).Returns(routeValues);

                // - permission repository
                var permissions = new PermissionRepository(dbContext);

                var req = new UserSiteAccessRequirement();
                var res = req.Evaluate(userClaim, httpContext.Object, permissions);

                // Then it should evaluate to True
                Assert.True(res);
            }
        }
        [Fact]
        public void Other_Controller_User_Has_Site_Access_Evaluate_Returns_True()
        {
            using (var dbContext = new TestContextProvider().Context) {
                // If user exists with access to site
                var user = UserHelper.CreateUser(dbContext);
                var site = SiteHelper.CreateSite(dbContext);
                PermissionHelper.CreateSitePermission(dbContext, user, site);

                // When requirement is evaluated with:
                // - claim for that user
                var claim = new Claim("sub", $"{user.Id}");
                var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {claim}));

                // - httpContext for request to other controller nested under that site
                var httpContext = new Mock<HttpContext>();
                var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
                    {"controller", "Other"},
                    {"siteId", $"{site.Id}"}
                });
                httpContext.Setup(hc => hc.Features.Get<IRoutingFeature>()).Returns(new Mock<IRoutingFeature>().Object);
                httpContext.Setup(hc => hc.Request.RouteValues).Returns(routeValues);

                // - permission repository
                var permissions = new PermissionRepository(dbContext);

                var req = new UserSiteAccessRequirement();
                var res = req.Evaluate(userClaim, httpContext.Object, permissions);

                // Then it should evaluate to True
                Assert.True(res);
            }
        }

        [Fact]
        public void User_Does_Not_Have_Site_Access_Evaluate_Returns_False()
        {
            using (var dbContext = new TestContextProvider().Context) {
                // If user exists with out access to any site
                var user = UserHelper.CreateUser(dbContext);

                // When requirement is evaluated with:
                // - claim for that user
                var claim = new Claim("sub", $"{user.Id}");
                var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {claim}));

                // - httpContext for request to 'Sites' controller for any site
                var httpContext = new Mock<HttpContext>();
                var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
                    {"controller", "Site"},
                    {"id", "1"}
                });
                httpContext.Setup(hc => hc.Features.Get<IRoutingFeature>()).Returns(new Mock<IRoutingFeature>().Object);
                httpContext.Setup(hc => hc.Request.RouteValues).Returns(routeValues);

                // - permission repository
                var permissions = new PermissionRepository(dbContext);

                var req = new UserSiteAccessRequirement();
                var res = req.Evaluate(userClaim, httpContext.Object, permissions);

                // Then it should evaluate to False
                Assert.False(res);
            }
        }

    }
}