using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using Hedwig.Repositories;
using Hedwig.Models;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;
using System.Collections.Generic;
using System.Threading;

namespace HedwigTests.Repositories
{
  public class EnrollmentRepositoryTests
  {
	[Fact]
	public void UpdateEnrollment_UpdatesFundings()
	{
	  Enrollment enrollment;
	  Funding funding;
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		enrollment = EnrollmentHelper.CreateEnrollment(context);
		funding = FundingHelper.CreateFunding(context, enrollment: enrollment);
	  }
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		var enrollmentRepo = new EnrollmentRepository(context);
		enrollmentRepo.UpdateEnrollment(enrollment);

		Assert.Equal(EntityState.Modified, context.Entry(enrollment).State);
		Assert.Equal(EntityState.Modified, context.Entry(enrollment.Fundings.First()).State);
	  }
	}

	[Fact]
	public void UpdateEnrollment_RemovesFundings()
	{
	  Enrollment enrollment;
	  Funding funding;
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		enrollment = EnrollmentHelper.CreateEnrollment(context);
		funding = FundingHelper.CreateFunding(context, enrollment: enrollment);
	  }

	  enrollment.Fundings = new List<Funding>();

	  using (var contextProvider = new TestHedwigContextProvider())
	  {
		var contextMock = contextProvider.ContextMock;
		var enrollmentRepo = new EnrollmentRepository(contextMock.Object);
		enrollmentRepo.UpdateEnrollment(enrollment);

		Assert.Equal(EntityState.Modified, contextMock.Object.Entry(enrollment).State);
		contextMock.Verify(c => c.Remove<IHedwigIdEntity<int>>(It.Is<Funding>(f => f.Id == funding.Id)), Times.Once());
	  }
	}

	[Fact]
	public void UpdateEnrollment_AddsFundings()
	{
	  Enrollment enrollment;
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		enrollment = EnrollmentHelper.CreateEnrollment(context);
		FundingHelper.CreateFunding(context, enrollment: enrollment);
	  }

	  enrollment.Fundings = new List<Funding>{
		enrollment.Fundings.First(),
		new Funding{Source = FundingSource.CDC}
	  };

	  using (var context = new TestHedwigContextProvider().Context)
	  {
		var enrollmentRepo = new EnrollmentRepository(context);
		enrollmentRepo.UpdateEnrollment(enrollment);

		Assert.Equal(EntityState.Modified, context.Entry(enrollment).State);
		Assert.Equal(EntityState.Added, context.Entry(enrollment.Fundings.Last()).State);
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
	[InlineData(new string[] { }, false, false, false, false)]
	[InlineData(new string[] { "fundings" }, true, false, false, false)]
	[InlineData(new string[] { "child" }, false, true, false, false)]
	[InlineData(new string[] { "family" }, false, false, false, false)]
	[InlineData(new string[] { "determinations" }, false, false, false, false)]
	[InlineData(new string[] { "child", "family" }, false, true, true, false)]
	[InlineData(new string[] { "child", "determinations" }, false, true, false, false)]
	[InlineData(new string[] { "child", "family", "determinations" }, false, true, true, true)]
	[InlineData(new string[] { "child", "family", "determinations", "fundings" }, true, true, true, true)]
	[InlineData(new string[] { "family", "determinations" }, false, false, false, false)]
	[InlineData(new string[] { "family", "determinations", "fundings" }, true, false, false, false)]

	public async Task GetEnrollmentsForSite_ReturnsEnrollmentsWithSiteId_IncludesEntities(
	  string[] include,
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
		var res = await enrollmentRepo.GetEnrollmentsForSiteAsync(siteId, include: include);

		Assert.Equal(ids.OrderBy(id => id), res.Select(e => e.Id).OrderBy(id => id));
		Assert.Equal(includeFundings, res.TrueForAll(e => e.Fundings != null));
		Assert.Equal(includeChildren, res.TrueForAll(e => e.Child != null));
		Assert.Equal(includeFamilies, res.TrueForAll(e => e.Child != null && e.Child.Family != null));
		Assert.Equal(includeDeterminations, res.TrueForAll(e => e.Child != null && e.Child.Family != null && e.Child.Family.Determinations != null));
	  }
	}

	[Theory]
	[InlineData(new string[] { }, false, false, false, false)]
	[InlineData(new string[] { "fundings" }, true, false, false, false)]
	[InlineData(new string[] { "child" }, false, true, false, false)]
	[InlineData(new string[] { "family" }, false, false, false, false)]
	[InlineData(new string[] { "determinations" }, false, false, false, false)]
	[InlineData(new string[] { "child", "family" }, false, true, true, false)]
	[InlineData(new string[] { "child", "determinations" }, false, true, false, false)]
	[InlineData(new string[] { "child", "family", "determinations" }, false, true, true, true)]
	[InlineData(new string[] { "child", "family", "determinations", "fundings" }, true, true, true, true)]
	[InlineData(new string[] { "family", "determinations" }, false, false, false, false)]
	[InlineData(new string[] { "family", "determinations", "fundings" }, true, false, false, false)]
	public async Task GetEnrollmentForSite_ReturnsEnrollmentWithIdAndSiteId_IncludesEntities(
	  string[] include,
	  bool includeFundings,
	  bool includeChild,
	  bool includeFamily,
	  bool includeDeterminations
		)
	{
	  int id;
	  int siteId;
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		var enrollment = EnrollmentHelper.CreateEnrollment(context);
		id = enrollment.Id;
		siteId = enrollment.SiteId;
	  }

	  using (var context = new TestHedwigContextProvider().Context)
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

		// then
		Assert.Equal(included, result.Contains(enrollment));
	  }
	}
  }
}
