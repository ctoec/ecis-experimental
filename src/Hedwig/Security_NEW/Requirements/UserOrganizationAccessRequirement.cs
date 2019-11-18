using System;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using Hedwig.Repositories;

namespace Hedwig.Security_NEW
{
    public class UserOrganizationAccessRequirement : IAuthorizationRequirement, IPermissionRequirement
    {  
        public const string NAME = "UserOrganizationAccess";

        public bool Evaluate(
            ClaimsPrincipal user,
            HttpContext httpContext,
            IPermissionRepository permissions
        )
        {
            return  UserCanAccessOrganization(user, httpContext, permissions);
        }

        private bool UserCanAccessOrganization(
            ClaimsPrincipal user,
            HttpContext httpContext,
            IPermissionRepository permissions
        )
        {
            var userIdStr = user.FindFirst("sub")?.Value;
            var routeData = httpContext.GetRouteData();
            // If request controller = 'Organizations', path param for organiation id is 'id'
            // else, path param is 'orgId'
            var orgIdParam = (string)routeData.Values["controller"] == "Organizations" ? "id" : "orgId";
            var orgIdStr = (string)routeData.Values[orgIdParam];
            if(userIdStr != null && orgIdStr != null) {
                var userId = Int32.Parse(userIdStr);
                var orgId = Int32.Parse(orgIdStr);
                return permissions.UserCanAccessOrganization(userId, orgId);
            }

            return false;

        }
    }
}
