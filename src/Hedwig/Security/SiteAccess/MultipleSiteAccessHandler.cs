using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Primitives;
using Hedwig.Repositories;

namespace Hedwig.Security
{
	public class MultipleSiteAccessHandler : AuthorizationHandler<SiteAccessRequirement>
	{
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly IPermissionRepository _permissions;

		public MultipleSiteAccessHandler(IHttpContextAccessor httpContextAccessor, IPermissionRepository permissions)
		{
				_httpContextAccessor = httpContextAccessor;
				_permissions = permissions;
		}

		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SiteAccessRequirement requirement)
		{
			var user = context.User;
			var userIdStr = user.FindFirst("sub")?.Value;

			StringValues siteIds;
			var siteIdsFound = _httpContextAccessor.HttpContext.Request.Query.TryGetValue("siteIds[]", out siteIds);
			if (!siteIdsFound || siteIds.Count == 0)
			{
				return Task.CompletedTask;
			}

			var canAccess = siteIds.All((siteIdStr) => {
				if (userIdStr != null && siteIdStr != null && siteIdStr != "")
				{
					var userId = Guid.Parse(userIdStr);
					var siteId = Int32.Parse(siteIdStr);
					return _permissions.UserCanAccessSite(userId, siteId);
				}
				return false;
			});

			// TODO: Allow for only organization level access
			var routeData = _httpContextAccessor.HttpContext.GetRouteData();
			var orgIdParam = ((string)routeData.Values["controller"]) == "Organizations" ? "id" : "orgId";
			var orgIdStr = (string)routeData.Values[orgIdParam];
			// END

			if (canAccess)
			{
				context.Succeed(requirement);
			}

			return Task.CompletedTask;
		}
	}
}