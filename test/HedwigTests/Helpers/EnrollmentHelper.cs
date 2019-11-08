using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class EnrollmentHelper
	{
		public static Enrollment CreateEnrollment(
			HedwigContext context,
			string entry = "2000-01-01",
			string exit = null,
			Age age = Age.Infant,
			Child child = null,
			Site site = null
		)
		{
			child = child ?? ChildHelper.CreateChild(context);
			site = site ?? SiteHelper.CreateSite(context);

			var enrollment = new Enrollment
			{
				ChildId = child.Id,
				SiteId = site.Id,
				Entry = DateTime.Parse(entry),
				Age = age
			};

			if (exit != null) enrollment.Exit = DateTime.Parse(exit);

			context.Enrollments.Add(enrollment);
			context.SaveChanges();
			return enrollment;
		}		
	}
}
