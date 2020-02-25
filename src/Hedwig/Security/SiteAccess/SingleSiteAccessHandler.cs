using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Repositories;

namespace Hedwig.Security
{
	public class SingleSiteAccessHandler : AuthorizationHandler<SiteAccessRequirement>
	{
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly IPermissionRepository _permissions;

		public SingleSiteAccessHandler(IHttpContextAccessor httpContextAccessor, IPermissionRepository permissions)
		{
			_httpContextAccessor = httpContextAccessor;
			_permissions = permissions;
		}

		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SiteAccessRequirement requirement)
		{
			var user = context.User;
			var userIdStr = user.FindFirst("sub")?.Value;
			var routeData = _httpContextAccessor.HttpContext.GetRouteData();
			// If request controller = 'Organizations', path param for organiation id is 'id'
			// else, path param is 'orgId'
			var siteIdParam = (string)routeData.Values["controller"] == "Sites" ? "id" : "siteId";
			var siteIdStr = (string)routeData.Values[siteIdParam];
			if (userIdStr != null && siteIdStr != null)
			{
				var userId = Guid.Parse(userIdStr);
				var siteId = Int32.Parse(siteIdStr);
				if (_permissions.UserCanAccessSite(userId, siteId))
				{
					context.Succeed(requirement);
				}
			}

			return Task.CompletedTask;
		}
	}
}
