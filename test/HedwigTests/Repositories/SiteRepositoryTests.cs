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
		public async Task GetSitesForOrganization()
		{
			using (var context = new TestContextProvider().Context)
			{
				var organization = OrganizationHelper.CreateOrganization(context);
				var sites = SiteHelper.CreateSites(context, 3, organization: organization);

				var siteRepo = new SiteRepository(context);
				var res = await siteRepo.GetSitesForOrganizationAsync(organization.Id);

				Assert.Equal(sites, res);
			}
		}

		[Theory]
		[InlineData(new string[]{}, false, false, false)]
		[InlineData(new string[]{"enrollments"}, true, false, false)]
		[InlineData(new string[]{"fundings"}, false, false, false)]
		[InlineData(new string[]{"child"}, false, false, false)]
		[InlineData(new string[]{"enrollments", "fundings"}, true, true, false)]
		[InlineData(new string[]{"enrollments", "child"}, true, false, true)]
		[InlineData(new string[]{"enrollments", "fundings", "child"}, true, true, true)]
		public async Task GetSiteForOrganization(
			string[] include,
			bool includeEnrollments,
			bool includeFundings,
			bool includeChildren
		)
		{
			int orgId;
			int id;
			using (var context = new TestContextProvider().Context)
			{
				var enrollment = EnrollmentHelper.CreateEnrollment(context);

				id = enrollment.SiteId;
				orgId = enrollment.Site.OrganizationId;
			}

			using (var context = new TestContextProvider().Context)
			{
				var siteRepo = new SiteRepository(context);
				var res = await siteRepo.GetSiteForOrganizationAsync(id, orgId, include);

				Assert.Equal(includeEnrollments, res.Enrollments != null);
				Assert.Equal(includeFundings, res.Enrollments != null && res.Enrollments.All(e => e.Fundings != null));
				Assert.Equal(includeChildren, res.Enrollments != null && res.Enrollments.All(e => e.Child != null));
			}
		}

		[Fact]
		public async Task Get_Sites_For_User_With_Site_Permission()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If site permissions exist with user Ids, and implicitly created site Ids
				var user = UserHelper.CreateUser(context);
				var sitePermission1 = PermissionHelper.CreateSitePermission(context, user: user);
				var sitePermission2 = PermissionHelper.CreateSitePermission(context, user: user);

				var otherUser = UserHelper.CreateUser(context);
				var otherSitePermission = PermissionHelper.CreateSitePermission(context, user: otherUser);

				// When the site repository is queried with a user id
				var siteRepo = new SiteRepository(context);
				var result = await siteRepo.GetSitesByUserIdAsync(user.Id);

				// Then a list of sites for which that user has permission is returned
				var siteIds = (from s in result select s.Id).ToArray();
				Assert.Contains(sitePermission1.SiteId, siteIds);
				Assert.Contains(sitePermission2.SiteId, siteIds);
				Assert.DoesNotContain(otherSitePermission.SiteId, siteIds);
			}
		}

		[Fact]
		public async Task Get_Sites_For_User_With_Organization_Permission()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If organization permissions exist with user Ids
				var user = UserHelper.CreateUser(context);
				var orgPermission1 = PermissionHelper.CreateOrganizationPermission(context, user: user);
				SiteHelper.CreateSite(context, organization: orgPermission1.Organization);
				var orgPermission2 = PermissionHelper.CreateOrganizationPermission(context, user: user);
				SiteHelper.CreateSite(context, organization: orgPermission2.Organization);

				var otherUser = UserHelper.CreateUser(context);
				var otherOrganizationPermission = PermissionHelper.CreateOrganizationPermission(context, user: otherUser);
				SiteHelper.CreateSite(context, organization: otherOrganizationPermission.Organization);

				// When the site repository is queried with a user id
				var siteRepo = new SiteRepository(context);
				var result = await siteRepo.GetSitesByUserIdAsync(user.Id);

				// Then a list of sites for which that user has permission is returned
				var siteIds = (from s in result select s.Id).ToArray();
				Assert.Contains(orgPermission1.Organization.Sites.ToArray()[0].Id, siteIds);
				Assert.Contains(orgPermission2.Organization.Sites.ToArray()[0].Id, siteIds);
				Assert.DoesNotContain(otherOrganizationPermission.Organization.Sites.ToArray()[0].Id, siteIds);
			}
		}

		[Fact]
		public async Task Get_Sites_For_User_With_Both_Site_And_Org_Permissions()
		{
			using (var context = new TestContextProvider().Context)
			{
				// If permissions exist with user Ids
				var user = UserHelper.CreateUser(context);
				var orgPermission = PermissionHelper.CreateOrganizationPermission(context, user: user);
				SiteHelper.CreateSite(context, organization: orgPermission.Organization);
				var sitePermission = PermissionHelper.CreateSitePermission(context, user: user, site: orgPermission.Organization.Sites.ToArray()[0]);

				// When the site repository is queried with a user id
				var siteRepo = new SiteRepository(context);
				var result = await siteRepo.GetSitesByUserIdAsync(user.Id);

				// Then a unique list of sites for which that user has permission is returned
				var siteIds = (from s in result select s.Id).ToArray();
				Assert.Contains(sitePermission.SiteId, siteIds);
				Assert.Single(siteIds);
			}
		}

		[Fact]
		public async Task Get_Sites_By_Organization_Ids()
		{
			using (var context = new TestContextProvider().Context)
			{
				// Given
				var org = OrganizationHelper.CreateOrganization(context);
				SiteHelper.CreateSite(context, organization: org);
				var otherOrg = OrganizationHelper.CreateOrganization(context);
				SiteHelper.CreateSite(context, organization: otherOrg);

				// When the site repository is queried with a user id
				var siteRepo = new SiteRepository(context);
				var result = await siteRepo.GetSitesByOrganizationIdsAsync_OLD(new int[] { org.Id });

				// Then the sites belonging to that organization are returned
				Assert.Single(result[org.Id]);
				Assert.Equal(result[org.Id].First().Id, org.Sites.First().Id);
				Assert.Empty(result[otherOrg.Id]);
			}
		}
	}
}
