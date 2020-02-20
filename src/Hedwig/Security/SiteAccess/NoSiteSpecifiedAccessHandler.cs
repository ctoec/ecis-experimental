using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Repositories;

namespace Hedwig.Security
{
	public class NoSiteSpecifiedAccessHandler : AuthorizationHandler<SiteAccessRequirement>
	{
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly IPermissionRepository _permissions;

		public NoSiteSpecifiedAccessHandler(IHttpContextAccessor httpContextAccessor, IPermissionRepository permissions)
		{
				_httpContextAccessor = httpContextAccessor;
				_permissions = permissions;
		}

		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SiteAccessRequirement requirement)
		{
			var user = context.User;
			var userIdStr = user.FindFirst("sub")?.Value;
			var routeData = _httpContextAccessor.HttpContext.GetRouteData();
			// If request controller = 'Sites', path param for organiation id is 'id'
			// else, path param is 'siteId'
			var siteIdParam = (string)routeData.Values["controller"] == "Sites" ? "id" : "siteId";
			var siteIdStr = (string)routeData.Values[siteIdParam];
      // If there is not a site id, allow access
			if (userIdStr != null && siteIdStr == null)
			{
				var userId = Guid.Parse(userIdStr);
        context.Succeed(requirement);
			}

			return Task.CompletedTask;
		}
	}
}