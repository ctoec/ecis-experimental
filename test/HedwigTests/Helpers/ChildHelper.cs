using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class ChildHelper
	{
		public static Child CreateChild(
			HedwigContext context,
			string firstName = "Test",
			string lastName = "Child",
			string birthdate = "2000-01-01",
			Gender gender = Gender.Unknown,
			Family family = null,
			Organization organization = null
		)
		{
			family = family ?? FamilyHelper.CreateFamily(context);
			organization = organization ?? OrganizationHelper.CreateOrganization(context);

			var child = new Child
			{
				FirstName = firstName,
				LastName = lastName,
				Birthdate = DateTime.Parse(birthdate),
				Gender = gender,
				FamilyId = family.Id,
				OrganizationId = organization.Id
			};

			context.Add<Child>(child);
			context.SaveChanges();
			return child;
		}

		public static List<Child> CreateChildren(HedwigContext context, int numberOfChildren)
		{
			var children = Enumerable.Range(1, numberOfChildren)
				.Select(i => CreateChild(context))
				.ToList();

			return children;
		}
	}
}
