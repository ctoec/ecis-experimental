using System;
using System.Linq;
using System.Collections.Generic;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class OrganizationPermissionHelper
	{
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
			context.OrganizationPermissions.Add(orgPermission);
			context.SaveChanges();
			return orgPermission;
		}
	}
}
