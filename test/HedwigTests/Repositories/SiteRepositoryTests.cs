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
				var anotherOrganization = OrganizationHelper.CreateOrganization(context);
				var sites = SiteHelper.CreateSites(context, 3, organization: organization);
				var otherSites = SiteHelper.CreateSite(context, organization: anotherOrganization);
				var siteIds = sites.Select(site => site.Id);

				var siteRepo = new SiteRepository(context);
				var res = await siteRepo.GetSitesForOrganizationAsync(organization.Id);
				var resIds = res.Select(rSite => rSite.Id);

				// Assert all returned sites are in the created sites with correct org id
				Assert.All(res, rSite => Assert.Contains(rSite.Id, siteIds));
				// Assert all created sites with correct org id are in the created sites
				Assert.All(siteIds, id => Assert.Contains(id, resIds));
				// Assert all returned sites have the correct org id
				Assert.All(res, rSite => Assert.Equal(rSite.OrganizationId, rSite.OrganizationId));
			}
		}

		[Theory]
		[InlineData(true, true, false)]
		public async Task GetSiteForOrganization_ReturnsSiteWithIdAndOrganizationId_IncludesEntities(
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
				var res = await siteRepo.GetSiteForOrganizationAsync(id, orgId);

				Assert.Equal(includeEnrollments, res.Enrollments != null);
				Assert.Equal(includeFundings, res.Enrollments != null && res.Enrollments.All(e => e.Fundings != null));
				Assert.Equal(includeChildren, res.Enrollments != null && res.Enrollments.All(e => e.Child != null));
			}
		}
	}
}
