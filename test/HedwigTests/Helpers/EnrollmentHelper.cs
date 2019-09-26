using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class EnrollmentHelper
	{
		public const string ENTRY_STR = "2000-01-01";
		public static Enrollment CreateEnrollment(HedwigContext context)
		{
			var child = ChildHelper.CreateChild(context);	
			var site = SiteHelper.CreateSite(context);
			var enrollment = new Enrollment {
				ChildId = child.Id,
				SiteId = site.Id,
				Entry = DateTime.Parse(ENTRY_STR)
			};
			context.Enrollments.Add(enrollment);
			context.SaveChanges();
			return enrollment;
		}

		public static Enrollment CreateEnrollmentWithSiteId(HedwigContext context, int siteId)
		{
			var child = ChildHelper.CreateChild(context);	
			var enrollment = new Enrollment {
				ChildId = child.Id,
				SiteId = siteId,
				Entry = DateTime.Parse(ENTRY_STR)
			};
			context.Enrollments.Add(enrollment);
			context.SaveChanges();
			return enrollment;
		}

		public static Enrollment CreateEnrollmentWithChildId(HedwigContext context, Guid childId)
		{
			var site = SiteHelper.CreateSite(context);
			var enrollment = new Enrollment {
				ChildId = childId,
				SiteId = site.Id,
				Entry = DateTime.Parse(ENTRY_STR)
			};

			context.Enrollments.Add(enrollment);
			context.SaveChanges();
			return enrollment;
		}
	}
}
