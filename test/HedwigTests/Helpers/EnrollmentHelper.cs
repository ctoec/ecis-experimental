using System;
using System.Collections.Generic;
using System.Linq;
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
			Age ageGroup = Age.InfantToddler,
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
				AgeGroup = ageGroup
			};

			if (exit != null) enrollment.Exit = DateTime.Parse(exit);

			context.Enrollments.Add(enrollment);
			context.SaveChanges();
			return enrollment;
		}

		public static List<Enrollment> CreateEnrollments(
			HedwigContext context,
			int numberOfEnrollments,
			Child child = null,
			Site site = null
		)
		{
			var enrollments = Enumerable.Range(0, numberOfEnrollments)
				.Select(i => CreateEnrollment(context, child: child, site: site))
				.ToList();

			return enrollments;
		}
	}
}
