using Microsoft.AspNetCore.Authorization;

namespace Hedwig.Security
{
	public class SiteAccessPolicyProvider : HedwigAuthorizationPolicyProvider
	{
		public const string NAME = "SiteAccessPolicy";

		private SiteAccessPolicyProvider()
		{
			AddRequirement(new SiteAccessRequirement());
		}

		public static AuthorizationPolicy GetPolicy()
		{
			return (new SiteAccessPolicyProvider()).GetDefaultPolicy();
		}
	}
}
