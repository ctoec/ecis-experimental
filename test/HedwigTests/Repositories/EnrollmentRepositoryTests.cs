using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Hedwig.Repositories;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Repositories
{
	public class EnrollmentRepositoryTests
	{
		[Fact]
		public void UpdateEnrollment()
		{
			using (var context = new TestContextProvider().Context)
			{
				var enrollment = new Enrollment();

				var enrollmentRepo = new EnrollmentRepository(context);
				enrollmentRepo.UpdateEnrollment(enrollment);

				Assert.Equal(EntityState.Modified, context.Entry(enrollment).State);
			}
		}
		[Fact]
		public void AddEnrollment()
		{
			using (var context = new TestContextProvider().Context)
			{
				var enrollment = new Enrollment();

				var enrollmentRepo = new EnrollmentRepository(context);
				enrollmentRepo.AddEnrollment(enrollment);

				Assert.Equal(EntityState.Added, context.Entry(enrollment).State);
			}
		}

        [Theory]
		[InlineData(new string[]{}, false, false, false, false)]
        [InlineData(new string[]{"fundings"}, true, false, false, false)]
		[InlineData(new string[]{"child"}, false, true, false, false)]
		[InlineData(new string[]{"family"}, false, false, false, false)]
		[InlineData(new string[]{"determinations"}, false,  false, false, false)]
        [InlineData(new string[]{"child", "family"}, false, true, true, false)]
        [InlineData(new string[]{"child", "determinations"}, false, true, false, false)]
        [InlineData(new string[]{"child", "family", "determinations"}, false, true, true, true)]
        [InlineData(new string[]{"child", "family", "determinations", "fundings"}, true, true, true, true)]
        [InlineData(new string[]{"family", "determinations"}, false, false, false, false)]
        [InlineData(new string[]{"family", "determinations", "fundings"}, true, false, false, false)]
 
		public async Task GetEnrollmentsForSite(
			string[] include,
			bool includeFundings,
			bool includeChildren,
			bool includeFamilies,
			bool includeDeterminations
		)
		{
			int[] ids;
			int siteId;
			using (var context = new TestContextProvider().Context)
			{
				var site = SiteHelper.CreateSite(context);
				var enrollments = EnrollmentHelper.CreateEnrollments(context, 3, site: site);
				ids = enrollments.Select(e => e.Id).ToArray();
				siteId = site.Id;
			}

			using (var context = new TestContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo.GetEnrollmentsForSiteAsync(siteId, include: include);

				Assert.Equal(ids.OrderBy(id => id), res.Select(e => e.Id).OrderBy(id => id));
				Assert.Equal(includeFundings, res.TrueForAll(e => e.Fundings != null));
				Assert.Equal(includeChildren, res.TrueForAll(e => e.Child != null));
				Assert.Equal(includeFamilies, res.TrueForAll(e => e.Child != null && e.Child.Family != null));
				Assert.Equal(includeDeterminations, res.TrueForAll(e => e.Child != null && e.Child.Family != null && e.Child.Family.Determinations != null));
			}
		}

		[Theory]
		[InlineData(new string[]{}, false, false, false, false)]
        [InlineData(new string[]{"fundings"}, true, false, false, false)]
		[InlineData(new string[]{"child"}, false, true, false, false)]
		[InlineData(new string[]{"family"}, false, false, false, false)]
		[InlineData(new string[]{"determinations"}, false,  false, false, false)]
        [InlineData(new string[]{"child", "family"}, false, true, true, false)]
        [InlineData(new string[]{"child", "determinations"}, false, true, false, false)]
        [InlineData(new string[]{"child", "family", "determinations"}, false, true, true, true)]
        [InlineData(new string[]{"child", "family", "determinations", "fundings"}, true, true, true, true)]
        [InlineData(new string[]{"family", "determinations"}, false, false, false, false)]
        [InlineData(new string[]{"family", "determinations", "fundings"}, true, false, false, false)]
		public async Task GetEnrollmentForSite(
			string[] include,
			bool includeFundings,
			bool includeChild,
			bool includeFamily,
			bool includeDeterminations
        )
		{
			int id;
			int siteId;
			using (var context = new TestContextProvider().Context)
			{
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				id = enrollment.Id;
				siteId = enrollment.SiteId;
			}

			using (var context = new TestContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo.GetEnrollmentForSiteAsync(id, siteId, include);

				Assert.Equal(id, res.Id);
				Assert.Equal(includeFundings, res.Fundings != null);
				Assert.Equal(includeChild, res.Child != null);
				Assert.Equal(includeFamily, res.Child != null && res.Child.Family != null);
				Assert.Equal(includeDeterminations, res.Child != null && res.Child.Family != null && res.Child.Family.Determinations != null);
			}
		}


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
		public async Task Get_Enrollments_By_Site_Id_Filtered_By_Date_Earlier_Start_No_Exit()
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

				// Then a list of enrollments with the specified enrollment is returned
				var enrollmentIds = (
					from e in res[site.Id]
					select e.Id
				).OrderBy(e => e);
				Assert.Equal(new int[] { enrollment.Id }, enrollmentIds);
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
