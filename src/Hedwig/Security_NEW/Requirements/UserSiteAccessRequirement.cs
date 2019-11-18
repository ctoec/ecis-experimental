using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;
using Hedwig.Repositories;

namespace Hedwig.Security_NEW
{
    public class UserSiteAccessRequirement : IPermissionRequirement
    {  
        public const string NAME = "UserSiteAccess";

        public bool Evaluate(
            ClaimsPrincipal user,
            HttpContext httpContext,
            IPermissionRepository permissions
        )
        {
            return UserCanAccessSite(user, httpContext, permissions);
        }
        
        private bool UserCanAccessSite(
            ClaimsPrincipal user,
            HttpContext httpContext,
            IPermissionRepository permissions 
        )
        {
            var userIdStr = user.FindFirst("sub")?.Value;
            var routeData = httpContext.GetRouteData();
            // If request controller is 'Sites', path param for site id is 'id'
            // else, path param is 'siteId'
            var siteIdParam = (string)routeData.Values["controller"] == "Sites" ? "id" : "siteId";
            var siteIdStr = (string)routeData.Values[siteIdParam];
            
            if(userIdStr != null && siteIdStr != null) {
                var userId = Int32.Parse(userIdStr);
                var siteId = Int32.Parse(siteIdStr);
                return permissions.UserCanAccessSite(userId, siteId);
            }

            return false;
        }
    }
}
