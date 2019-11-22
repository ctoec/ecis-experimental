using System;
using System.Collections.Generic;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class OrganizationHelper
	{
		public static Organization CreateOrganization(
			HedwigContext context,
			string name = "Test Organization",
			ICollection<Site> sites = null
		)
		{
			var organization = new Organization { Name = name, Sites = sites };
			context.Organizations.Add(organization);
			context.SaveChanges();
			return organization;
		}
	}
}
