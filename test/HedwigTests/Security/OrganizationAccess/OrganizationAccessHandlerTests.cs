using Xunit;
using Moq;
using System.Security.Claims;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Repositories;
using Hedwig.Security;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Security
{
    public class OrganizationAccessHandlerTests
    {
        [Fact]
        public void Organization_Controller_User_Has_Organization_Access_Evaluate_Returns_True()
        {
            using (var dbContext = new TestHedwigContextProvider().Context) {
                // If user exists with access to organization
                var user = UserHelper.CreateUser(dbContext);
                var organization = OrganizationHelper.CreateOrganization(dbContext);
                PermissionHelper.CreateOrganizationPermission(dbContext, user, organization);

                // When requirement is evaluated with:
                // - claim for that user
                var claim = new Claim("sub", $"{user.WingedKeysId}");
                var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {claim}));

                // - httpContext for request to 'Organizations' controller for that organization
                var httpContext = new Mock<HttpContext>();
                var httpContextAccessor = new HttpContextAccessor {
                    HttpContext = httpContext.Object
                };
                var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
                    {"controller", "Organizations"},
                    {"id", $"{organization.Id}"}
                });
                httpContext.Setup(hc => hc.Features.Get<IRoutingFeature>()).Returns(new Mock<IRoutingFeature>().Object);
                httpContext.Setup(hc => hc.Request.RouteValues).Returns(routeValues);

                // - permission repository
                var permissions = new PermissionRepository(dbContext);

                var reqHandler = new OrganizationAccessHandler(httpContextAccessor, permissions);
                var req = new OrganizationAccessRequirement();

                var authContext = new AuthorizationHandlerContext(new List<IAuthorizationRequirement> { req }, userClaim, new object());

                // When requirement handler handles authorization context
                reqHandler.HandleAsync(authContext);

                // Then authorization context will have succeeded
                Assert.True(authContext.HasSucceeded);
            }
        }

        [Fact]
        public void Other_Controller_User_Has_Organization_Access_Evaluate_Returns_True()
        {
            using (var dbContext = new TestHedwigContextProvider().Context) {
                // If user exists with access to organization
                var user = UserHelper.CreateUser(dbContext);
                var organization = OrganizationHelper.CreateOrganization(dbContext);
                PermissionHelper.CreateOrganizationPermission(dbContext, user, organization);

                // When requirement is evaluated with:
                // - claim for that user
                var claim = new Claim("sub", $"{user.WingedKeysId}");
                var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {claim}));

                // - httpContext for request to other controller nested under that organization
                var httpContext = new Mock<HttpContext>();
                var httpContextAccessor = new HttpContextAccessor {
                    HttpContext = httpContext.Object
                };
                var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
                    {"controller", "Other"},
                    {"orgId", $"{organization.Id}"}
                });
                httpContext.Setup(hc => hc.Features.Get<IRoutingFeature>()).Returns(new Mock<IRoutingFeature>().Object);
                httpContext.Setup(hc => hc.Request.RouteValues).Returns(routeValues);

                // - permission repository
                var permissions = new PermissionRepository(dbContext);

                var reqHandler = new OrganizationAccessHandler(httpContextAccessor, permissions);
                var req = new OrganizationAccessRequirement();

                var authContext = new AuthorizationHandlerContext(new List<IAuthorizationRequirement> { req }, userClaim, new object());

                // When requirement handler handles authorization context
                reqHandler.HandleAsync(authContext);

                // Then authorization context will have succeeded
                Assert.True(authContext.HasSucceeded);
            }
        }


        [Fact]
        public void User_Does_Not_Have_Organization_Access_Evaluate_Returns_False()
        {
            using (var dbContext = new TestHedwigContextProvider().Context) {
                // If user exists without access to any organization
                var user = UserHelper.CreateUser(dbContext);

                // When requirement is evaluated with:
                // - claim for that user
                var claim = new Claim("sub", $"{user.WingedKeysId}");
                var userClaim = new ClaimsPrincipal(new ClaimsIdentity(new Claim[] {claim}));

                // - httpContext for request to 'Organizations' controller for any organization
                var httpContext = new Mock<HttpContext>();
                var httpContextAccessor = new HttpContextAccessor {
                    HttpContext = httpContext.Object
                };
                var routeValues = new RouteValueDictionary(new Dictionary<string, string>{
                    {"controller", "Organizations"},
                    {"id", "1"}
                });
                httpContext.Setup(hc => hc.Features.Get<IRoutingFeature>()).Returns(new Mock<IRoutingFeature>().Object);
                httpContext.Setup(hc => hc.Request.RouteValues).Returns(routeValues);

                // - permission repository
                var permissions = new PermissionRepository(dbContext);

                var reqHandler = new OrganizationAccessHandler(httpContextAccessor, permissions);
                var req = new OrganizationAccessRequirement();

                var authContext = new AuthorizationHandlerContext(new List<IAuthorizationRequirement> { req }, userClaim, new object());

                // When requirement handler handles authorization context
                reqHandler.HandleAsync(authContext);

                // Then authorization context will have succeeded
                Assert.False(authContext.HasSucceeded);
            }
        }
    }
}