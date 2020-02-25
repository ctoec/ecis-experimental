using Microsoft.AspNetCore.Authorization;

namespace Hedwig.Security
{
	public class OrganizationAccessPolicyProvider : HedwigAuthorizationPolicyProvider
	{
		public const string NAME = "OrganizationAccessPolicy";

		protected OrganizationAccessPolicyProvider() : base()
		{
			AddRequirement(new OrganizationAccessRequirement());
		}

		public static AuthorizationPolicy GetPolicy()
		{
			return (new OrganizationAccessPolicyProvider()).GetDefaultPolicy();
		}
	}
}
