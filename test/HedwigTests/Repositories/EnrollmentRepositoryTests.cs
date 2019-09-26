using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Models;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
	[Collection("SqlServer")]
	public class EnrollmentRepositoryTests
	{
		[Fact]
		public async Task Get_Enrollment_By_Id()
		{
			using (var context = new TestContextProvider().Context) {
				// If an enrollment exists
				var enrollment = EnrollmentHelper.CreateEnrollment(context);

				// When the repository is queried by Id
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo.GetEnrollmentByIdAsync(enrollment.Id);

				// Then the enrollment with that Id is returned
				Assert.Equal(enrollment.Id, res.Id);
				Assert.Equal(enrollment.ChildId, res.ChildId);
			}
		}	

		[Fact]
		public async Task Get_Enrollments_By_Site_Id()
		{
			using (var context = new TestContextProvider().Context) {
			// If enrollments exists with site Ids
			var site1 = SiteHelper.CreateSite(context);
			var enrollment1 = EnrollmentHelper.CreateEnrollmentWithSiteId(context, site1.Id);
			var site2 = SiteHelper.CreateSite(context);
			var enrollment1Site2 = EnrollmentHelper.CreateEnrollmentWithSiteId(context, site2.Id);
			var enrollment2Site2 = EnrollmentHelper.CreateEnrollmentWithSiteId(context, site2.Id);

			// When the repository is queried with a site Id
			var enrollmentRepo = new EnrollmentRepository(context);
			var res = await enrollmentRepo.GetEnrollmentsBySiteIdsAsync(new int[] { site2.Id });
		
			// Then a list of enrollments with that site Id is returned
			var enrollmentIds = (from e in res[site2.Id]
								select e.Id).OrderBy(e => e);
			Assert.Equal(new int[] {enrollment1Site2.Id, enrollment2Site2.Id}, enrollmentIds);

			// And no other site Ids are included
			Assert.False(res.Contains(site1.Id));
			}
		}
	}
}
