using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using Xunit;
using Hedwig.Models;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Repositories
{
	public class EnrollmentRepositoryTests
	{
		[Fact]
		public void UpdateEnrollment_UpdatesFundings()
		{
			Enrollment enrollment;
			Funding funding;
			ReportingPeriod reportingPeriod;
			using (var context = new TestHedwigContextProvider().Context)
			{
				enrollment = EnrollmentHelper.CreateEnrollment(context);
				funding = FundingHelper.CreateFunding(context, enrollment: enrollment);
				reportingPeriod = ReportingPeriodHelper.CreateReportingPeriod(context);
			}

			Assert.Null(funding.FirstReportingPeriodId);

			funding.FirstReportingPeriodId = reportingPeriod.Id;
			enrollment.Fundings = new List<Funding> {
				funding
			};

			enrollment.Fundings.FirstOrDefault().Enrollment = null;

			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var mapper = new MapperConfiguration(opts =>
				{
					opts.AddProfile(new EnrollmentProfile());
					opts.AddProfile(new FundingProfile());
					opts.AddProfile(new FundingSpaceProfile());
					opts.AddProfile(new ChildProfile());
					opts.AddProfile(new FamilyProfile());
					opts.AddProfile(new SiteProfile());
				}).CreateMapper();
				var enrollmentDTO = mapper.Map<Enrollment, EnrollmentDTO>(enrollment);
				enrollmentRepo.UpdateEnrollment(enrollment, enrollmentDTO);
				context.SaveChanges();
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var retrievedEnrollment = context.Enrollments
					.Where(e => e.Id == enrollment.Id)
					.Include(e => e.Fundings)
					.FirstOrDefault();
				var retrievedFunding = retrievedEnrollment.Fundings.FirstOrDefault();

				Assert.NotNull(retrievedFunding.FirstReportingPeriodId);
				Assert.Equal(funding.FirstReportingPeriodId, retrievedFunding.FirstReportingPeriodId);
			}
		}

		[Fact]
		public void UpdateEnrollment_RemovesFundings()
		{
			Enrollment enrollment;
			using (var context = new TestHedwigContextProvider().Context)
			{
				enrollment = EnrollmentHelper.CreateEnrollment(context);
				FundingHelper.CreateFunding(context, enrollment: enrollment);
			}

			Assert.NotEmpty(enrollment.Fundings);
			enrollment.Fundings = new List<Funding>();

			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var mapper = new MapperConfiguration(opts =>
				{
					opts.AddProfile(new EnrollmentProfile());
					opts.AddProfile(new FundingProfile());
					opts.AddProfile(new ChildProfile());
					opts.AddProfile(new FamilyProfile());
					opts.AddProfile(new SiteProfile());
				}).CreateMapper();
				var enrollmentDTO = mapper.Map<Enrollment, EnrollmentDTO>(enrollment);
				enrollmentRepo.UpdateEnrollment(enrollment, enrollmentDTO);
				context.SaveChanges();
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var retrievedEnrollment = enrollmentRepo.GetEnrollmentById(enrollment.Id);
				Assert.Empty(retrievedEnrollment.Fundings);
			}
		}

		[Fact]
		public void UpdateEnrollment_AddsFundings()
		{
			Enrollment enrollment;
			FundingSpace fundingSpace;
			using (var context = new TestHedwigContextProvider().Context)
			{
				enrollment = EnrollmentHelper.CreateEnrollment(context);
				fundingSpace = FundingSpaceHelper.CreateFundingSpace(
					context,
					organizationId: enrollment.Site.OrganizationId,
					source: FundingSource.CDC,
					ageGroup: enrollment.AgeGroup.Value
				);
			}

			Funding funding = new Funding
			{
				EnrollmentId = enrollment.Id,
				Source = FundingSource.CDC,
				FundingSpaceId = fundingSpace.Id
			};

			Assert.Null(enrollment.Fundings);

			enrollment.Fundings = new List<Funding> {
				funding
			};

			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var mapper = new MapperConfiguration(opts =>
				{
					opts.AddProfile(new EnrollmentProfile());
					opts.AddProfile(new FundingProfile());
					opts.AddProfile(new ChildProfile());
					opts.AddProfile(new FamilyProfile());
					opts.AddProfile(new SiteProfile());

				}).CreateMapper();
				var enrollmentDTO = mapper.Map<Enrollment, EnrollmentDTO>(enrollment);
				enrollmentRepo.UpdateEnrollment(enrollment, enrollmentDTO);
				context.SaveChanges();
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var retrievedEnrollment = enrollmentRepo.GetEnrollmentById(enrollment.Id);
				Assert.NotEmpty(retrievedEnrollment.Fundings);

				var retrievedFunding = retrievedEnrollment.Fundings.FirstOrDefault();
				Assert.Equal(funding.Id, retrievedFunding.Id);
			}
		}

		[Fact]
		public void AddEnrollment()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollment = new Enrollment();

				var enrollmentRepo = new EnrollmentRepository(context);
				enrollmentRepo.AddEnrollment(enrollment);

				Assert.Equal(EntityState.Added, context.Entry(enrollment).State);
			}
		}

		[Fact]
		public void DeleteEnrollment()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollment = new Enrollment();

				var enrollmentRepo = new EnrollmentRepository(context);
				enrollmentRepo.AddEnrollment(enrollment);

				Assert.Equal(EntityState.Added, context.Entry(enrollment).State);

				enrollmentRepo.DeleteEnrollment(enrollment);

				Assert.Equal(EntityState.Detached, context.Entry(enrollment).State);
			}
		}

		[Fact]
		public void DeleteEnrollment_DeletesDanglingSubObjects()
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollment = new Enrollment();
				var child = new Child();
				var funding = new Funding();
				enrollment.Id = 1;
				funding.Enrollment = enrollment;
				funding.EnrollmentId = enrollment.Id;
				enrollment.Child = child;

				var enrollmentRepo = new EnrollmentRepository(context);
				var fundingRepo = new FundingRepository(context);
				enrollmentRepo.AddEnrollment(enrollment);

				Assert.Equal(EntityState.Added, context.Entry(enrollment).State);

				enrollmentRepo.DeleteEnrollment(enrollment);

				Assert.Equal(EntityState.Detached, context.Entry(funding).State);
				Assert.Equal(EntityState.Added, context.Entry(child).State);
				Assert.Equal(EntityState.Detached, context.Entry(enrollment).State);
			}
		}

		[Theory]
		[InlineData(true, true, true, true)]

		public async Task GetEnrollmentsForSite_ReturnsEnrollmentsWithSiteId_IncludesEntities(
			bool includeFundings,
			bool includeChildren,
			bool includeFamilies,
			bool includeDeterminations
		)
		{
			int[] ids;
			int siteId;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var site = SiteHelper.CreateSite(context);
				var enrollments = EnrollmentHelper.CreateEnrollments(context, 3, site: site);
				ids = enrollments.Select(e => e.Id).ToArray();
				siteId = site.Id;
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo.GetEnrollmentsForSiteAsync(siteId);

				Assert.Equal(ids.OrderBy(id => id), res.Select(e => e.Id).OrderBy(id => id));
				Assert.Equal(includeFundings, res.TrueForAll(e => e.Fundings != null));
				Assert.Equal(includeChildren, res.TrueForAll(e => e.Child != null));
				Assert.Equal(includeFamilies, res.TrueForAll(e => e.Child != null && e.Child.Family != null));
				Assert.Equal(includeDeterminations, res.TrueForAll(e => e.Child != null && e.Child.Family != null && e.Child.Family.Determinations != null));
			}
		}

		[Theory]
		[InlineData(true, true, true, true, true)]

		public async Task GetEnrollmentForSite_ReturnsEnrollmentWithIdAndSiteId_IncludesEntities(
			bool includeFundings,
			bool includeChild,
			bool includeFamily,
			bool includeDeterminations,
			bool includePastEnrollments
			)
		{
			int id;
			int siteId;
			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollment = EnrollmentHelper.CreateEnrollment(context);
				EnrollmentHelper.CreateEnrollment(context, child: enrollment.Child);
				id = enrollment.Id;
				siteId = enrollment.SiteId;
			}

			using (var context = new TestHedwigContextProvider().Context)
			{
				var enrollmentRepo = new EnrollmentRepository(context);
				var res = await enrollmentRepo.GetEnrollmentForSiteAsync(id, siteId);

				Assert.Equal(id, res.Id);
				Assert.Equal(includeFundings, res.Fundings != null);
				Assert.Equal(includeChild, res.Child != null);
				Assert.Equal(includeFamily, res.Child != null && res.Child.Family != null);
				Assert.Equal(includeDeterminations, res.Child != null && res.Child.Family != null && res.Child.Family.Determinations != null);
				Assert.Equal(includePastEnrollments, res.PastEnrollments != null);
			}
		}

		[Theory]
		// exit null, from/to includes start -> include
		[InlineData("2019-02-01", null, "2019-01-01", "2019-03-01", true)]
		// exit null, from/to after start -> include
		[InlineData("2019-02-01", null, "2019-03-01", "2019-03-01", true)]
		// exit null, from/to before start -> do not include
		[InlineData("2019-02-01", null, "2019-01-01", "2019-01-30", false)]
		// from/to includes start and end -> include
		[InlineData("2019-02-01", "2019-06-01", "2019-01-01", "2019-07-01", true)]
		// from/to after start and end -> do not include
		[InlineData("2019-02-01", "2019-06-01", "2020-01-01", "2020-07-01", false)]
		// from/to includes start, before end -> include
		[InlineData("2019-02-01", "2019-06-01", "2019-01-01", "2019-03-01", true)]
		// from/to includes end, after start -> include
		[InlineData("2019-02-01", "2019-06-01", "2019-03-01", "2019-07-01", true)]
		public async Task GetEnrollmentsForSite_FiltersByDates(
			string entry,
			string exit,
			string from,
			string to,
			bool included
		)
		{
			using (var context = new TestHedwigContextProvider().Context)
			{
				// if enrollment exists with entry and exit
				var enrollment = EnrollmentHelper.CreateEnrollment(context, entry, exit);

				// when repo is queried with to and from
				var enrollmentRepo = new EnrollmentRepository(context);
				var result = await enrollmentRepo.GetEnrollmentsForSiteAsync(
					enrollment.SiteId,
					DateTime.Parse(from),
					DateTime.Parse(to)
				);
				var resultIds = result.Select(e => e.Id);

				// then
				Assert.Equal(included, resultIds.Contains(enrollment.Id));
			}
		}
	}
}
