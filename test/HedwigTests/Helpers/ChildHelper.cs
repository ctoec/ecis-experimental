using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class ChildHelper
	{
		public const string FIRST_NAME = "Test";
		public const string LAST_NAME = "Child";
		public const string BIRTHDATE_STR = "2000-01-01";
		public const Gender GENDER = Gender.Unknown;

		public static Child CreateChild(HedwigContext context, string firstNameOverride = "", int familyIdOverride = 0)
		{
			var child = new Child {
				FirstName = !string.IsNullOrWhiteSpace(firstNameOverride) ? firstNameOverride : FIRST_NAME,
				LastName = LAST_NAME,
				Birthdate = DateTime.Parse(BIRTHDATE_STR),
				Gender = GENDER
			};

			if(familyIdOverride > 0) {
				child.FamilyId = familyIdOverride;
			}
			
			context.Children.Add(child);
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
