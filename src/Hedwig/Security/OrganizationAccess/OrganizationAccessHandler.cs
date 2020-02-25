using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Hedwig.Repositories;

namespace Hedwig.Security
{
	public class OrganizationAccessHandler : AuthorizationHandler<OrganizationAccessRequirement>
	{
		private readonly IHttpContextAccessor _httpContextAccessor;
		private readonly IPermissionRepository _permissions;

		public OrganizationAccessHandler(IHttpContextAccessor httpContextAccessor, IPermissionRepository permissions)
		{
			_httpContextAccessor = httpContextAccessor;
			_permissions = permissions;
		}

		protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OrganizationAccessRequirement requirement)
		{
			var user = context.User;
			var userIdStr = user.FindFirst("sub")?.Value;
			var routeData = _httpContextAccessor.HttpContext.GetRouteData();
			// If request controller = 'Organizations', path param for organiation id is 'id'
			// else, path param is 'orgId'
			var orgIdParam = ((string)routeData.Values["controller"]) == "Organizations" ? "id" : "orgId";
			var orgIdStr = (string)routeData.Values[orgIdParam];
			if (userIdStr != null && orgIdStr != null)
			{
				var userId = Guid.Parse(userIdStr);
				var orgId = Int32.Parse(orgIdStr);
				if (_permissions.UserCanAccessOrganization(userId, orgId))
				{
					context.Succeed(requirement);
				}
			}

			return Task.CompletedTask;
		}
	}
}
