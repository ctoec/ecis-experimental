using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class FamilyHelper
	{
		public static Family CreateFamily(
			HedwigContext context,
			Organization organization = null
		)
		{
			organization = organization ?? OrganizationHelper.CreateOrganization(context);
			
			var family = new Family();
			context.Add<Family>(family);
			context.SaveChanges();
			return family;
		}

		public static List<Family> CreateFamilies(HedwigContext context, int numberOfFamilies)
		{
			var families = Enumerable.Range(1, numberOfFamilies)
				.Select(i => CreateFamily(context))
				.ToList();

			return families;
		}
	}
}
