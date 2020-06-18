using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class PermissionHelper
	{
		public static SitePermission CreateSitePermission(
			HedwigContext context,
			User user = null,
			Site site = null
		)
		{
			user = user ?? UserHelper.CreateUser(context);
			site = site ?? SiteHelper.CreateSite(context);

			var sitePermission = new SitePermission
			{
				SiteId = site.Id,
				UserId = user.Id
			};
			context.Permissions.Add(sitePermission);
			context.SaveChanges();
			return sitePermission;
		}

		public static OrganizationPermission CreateOrganizationPermission(
			HedwigContext context,
			User user = null,
			Organization org = null
		)
		{
			user = user ?? UserHelper.CreateUser(context);
			org = org ?? OrganizationHelper.CreateOrganization(context);

			var orgPermission = new OrganizationPermission
			{
				OrganizationId = org.Id,
				UserId = user.Id
			};
			context.Permissions.Add(orgPermission);
			context.SaveChanges();
			return orgPermission;
		}
	}
}
