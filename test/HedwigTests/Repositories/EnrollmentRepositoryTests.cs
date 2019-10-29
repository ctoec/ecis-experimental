using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Repositories
{
	public class EnrollmentRepositoryTests
	{
		[Fact]
		public async Task Get_Enrollment_By_Id()
		{
			using (var context = new TestContextProvider().Context)
			{
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
			using (var context = new TestContextProvider().Context)
			{
				// If enrollments exists with site Ids
				var site1 = SiteHelper.CreateSite(context);
				var enrollment1 = EnrollmentHelper.CreateEnrollment(context, site: site1);
				var site2 = SiteHelper.CreateSite(context);
				var enrollment1Site2 = EnrollmentHelper.CreateEnrollment(context, site: site2);
				var enrollment2Site2 = EnrollmentHelper.CreateEnrollment(context, site: site2);

				// When the repository is queried with a site Id
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo.GetEnrollmentsBySiteIdsAsync(new int[] { site2.Id });

				// Then a list of enrollments with that site Id is returned
				var enrollmentIds = (from e in res[site2.Id]
														 select e.Id).OrderBy(e => e);
				Assert.Equal(new int[] { enrollment1Site2.Id, enrollment2Site2.Id }, enrollmentIds);

				// And no other site Ids are included
				Assert.False(res.Contains(site1.Id));
			}
		}

		[Fact]
		public async Task Get_Enrollments_By_Site_Id_Filtered_By_Date_Valid_Start_No_Exit()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If an enrollment exist in a site with 
				// a start date of 01-01-2019 and no exit date
				var site = SiteHelper.CreateSite(context);
				var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site);
				enrollment.Entry = new DateTime(2019, 1, 1, 0, 0, 0);
				enrollment.Exit = null;
				context.SaveChanges();

				// When an enrollment repository is queried with a site id
				// and a from date before 01-01-2019
				DateTime from = new DateTime(2018, 1, 1, 0, 0, 0);
				// and a to date after 01-01-2019
				DateTime to = new DateTime(2020, 1, 1, 0, 0, 0);
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo
					.GetEnrollmentsBySiteIdsAsync(new int[] { site.Id }, from: from, to: to);

				// Then a list of enrollments with the specified enrollment is returned
				var enrollmentIds = (
					from e in res[site.Id]
					select e.Id
				).OrderBy(e => e);
				Assert.Equal(new int[] { enrollment.Id }, enrollmentIds);
			}
		}

		[Fact]
		public async Task Get_Enrollments_By_Site_Id_Filtered_By_Date_Invalid_Start_No_Exit()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If an enrollment exist in a site with 
				// a start date of 01-01-2019 and no exit date
				var site = SiteHelper.CreateSite(context);
				var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site);
				enrollment.Entry = new DateTime(2019, 1, 1, 0, 0, 0);
				enrollment.Exit = null;
				context.SaveChanges();

				// When an enrollment repository is queried with a site id
				// and a from date after 01-01-2019
				DateTime from = new DateTime(2019, 6, 1, 0, 0, 0);
				// and a to date after 01-01-2019
				DateTime to = new DateTime(2020, 1, 1, 0, 0, 0);
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo
					.GetEnrollmentsBySiteIdsAsync(new int[] { site.Id }, from: from, to: to);

				// Then a list of enrollments without the specified enrollment is returned
				var enrollmentIds = (
					from e in res[site.Id]
					select e.Id
				).OrderBy(e => e);
				Assert.Equal(new int[] { }, enrollmentIds);
			}
		}

		[Fact]
		public async Task Get_Enrollments_By_Site_Id_Filtered_By_Date_Valid_Start_Valid_Exit()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If an enrollment exist in a site with 
				// a start date of 01-01-2019
				// and exit date of 06-01-2019
				var site = SiteHelper.CreateSite(context);
				var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site);
				enrollment.Entry = new DateTime(2019, 1, 1, 0, 0, 0);
				enrollment.Exit = new DateTime(2019, 6, 1, 0, 0, 0);
				context.SaveChanges();

				// When an enrollment repository is queried with a site id
				// and a from date before 01-01-2019
				DateTime from = new DateTime(2018, 1, 1, 0, 0, 0);
				// and a to date after 06-01-2019
				DateTime to = new DateTime(2020, 1, 1, 0, 0, 0);
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo
					.GetEnrollmentsBySiteIdsAsync(new int[] { site.Id }, from: from, to: to);

				// Then a list of enrollments with the specified enrollment is returned
				var enrollmentIds = (
					from e in res[site.Id]
					select e.Id
				).OrderBy(e => e);
				Assert.Equal(new int[] { enrollment.Id }, enrollmentIds);
			}
		}

		[Fact]
		public async Task Get_Enrollments_By_Site_Id_Filtered_By_Date_Invalid_Start_Invalid_Exit_After()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If an enrollment exist in a site with 
				// a start date of 01-01-2019 
				// and a exit date of 01-01-2020
				var site = SiteHelper.CreateSite(context);
				var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site);
				enrollment.Entry = new DateTime(2019, 1, 1, 0, 0, 0);
				enrollment.Exit = new DateTime(2020, 1, 1, 0, 0, 0);
				context.SaveChanges();

				// When an enrollment repository is queried with a site id
				// and a from date after 01-01-2020
				DateTime from = new DateTime(2020, 2, 1, 0, 0, 0);
				// and a to date after 01-01-2020
				DateTime to = new DateTime(2020, 3, 1, 0, 0, 0);
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo
					.GetEnrollmentsBySiteIdsAsync(new int[] { site.Id }, from: from, to: to);

				// Then a list of enrollments without the specified enrollment is returned
				var enrollmentIds = (
					from e in res[site.Id]
					select e.Id
				).OrderBy(e => e);
				Assert.Equal(new int[] { }, enrollmentIds);
			}
		}

		[Fact]
		public async Task Get_Enrollments_By_Site_Id_Filtered_By_Date_Invalid_Start_Invalid_Exit_Before()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If an enrollment exist in a site with 
				// a start date of 01-01-2019 
				// and a exit date of 01-01-2020
				var site = SiteHelper.CreateSite(context);
				var enrollment = EnrollmentHelper.CreateEnrollment(context, site: site);
				enrollment.Entry = new DateTime(2019, 1, 1, 0, 0, 0);
				enrollment.Exit = new DateTime(2020, 1, 1, 0, 0, 0);
				context.SaveChanges();

				// When an enrollment repository is queried with a site id
				// and a from date before 01-01-2019
				DateTime from = new DateTime(2018, 2, 1, 0, 0, 0);
				// and a to date before 01-01-2019
				DateTime to = new DateTime(2018, 3, 1, 0, 0, 0);
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo
					.GetEnrollmentsBySiteIdsAsync(new int[] { site.Id }, from: from, to: to);

				// Then a list of enrollments without the specified enrollment is returned
				var enrollmentIds = (
					from e in res[site.Id]
					select e.Id
				).OrderBy(e => e);
				Assert.Equal(new int[] { }, enrollmentIds);
			}
		}
	}
}
