using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;
using HedwigTests.Fixtures;

namespace HedwigTests.Repositories
{
  public class SiteRepositoryTests
  {
	[Fact]
	public async Task GetSitesForOrganizationAsync_ReturnsSitesWithOrganizationId()
	{
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		var organization = OrganizationHelper.CreateOrganization(context);
		var sites = SiteHelper.CreateSites(context, 3, organization: organization);

		var siteRepo = new SiteRepository(context);
		var res = await siteRepo.GetSitesForOrganizationAsync(organization.Id);

		Assert.Equal(sites, res);
	  }
	}

	[Theory]
	[InlineData(new string[] { }, false, false, false)]
	[InlineData(new string[] { "enrollments" }, true, false, false)]
	[InlineData(new string[] { "fundings" }, false, false, false)]
	[InlineData(new string[] { "child" }, false, false, false)]
	[InlineData(new string[] { "enrollments", "fundings" }, true, true, false)]
	[InlineData(new string[] { "enrollments", "child" }, true, false, true)]
	[InlineData(new string[] { "enrollments", "fundings", "child" }, true, true, true)]
	public async Task GetSiteForOrganization_ReturnsSiteWithIdAndOrganizationId_IncludesEntities(
		string[] include,
		bool includeEnrollments,
		bool includeFundings,
		bool includeChildren
	)
	{
	  int orgId;
	  int id;
	  using (var context = new TestHedwigContextProvider().Context)
	  {
		var enrollment = EnrollmentHelper.CreateEnrollment(context);

		id = enrollment.SiteId;
		orgId = enrollment.Site.OrganizationId;
	  }

	  using (var context = new TestHedwigContextProvider().Context)
	  {
		var siteRepo = new SiteRepository(context);
		var res = await siteRepo.GetSiteForOrganizationAsync(id, orgId, include);

		Assert.Equal(includeEnrollments, res.Enrollments != null);
		Assert.Equal(includeFundings, res.Enrollments != null && res.Enrollments.All(e => e.Fundings != null));
		Assert.Equal(includeChildren, res.Enrollments != null && res.Enrollments.All(e => e.Child != null));
	  }
	}
  }
}
