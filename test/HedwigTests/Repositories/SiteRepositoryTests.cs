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
				// If organization permissions exist with user Ids, and implicitly created site Ids
				var user = UserHelper.CreateUser(context);
				var orgPermission1 = PermissionHelper.CreateOrganizationPermission(context, user: user);
				var orgPermission2 = PermissionHelper.CreateOrganizationPermission(context, user: user);

				var otherUser = UserHelper.CreateUser(context);
				var otherOrganizationPermission = PermissionHelper.CreateOrganizationPermission(context, user: otherUser);

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
				// If permissions exist with user Ids, and implicitly created site Ids
				var user = UserHelper.CreateUser(context);
				var orgPermission = PermissionHelper.CreateOrganizationPermission(context, user: user);
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
	}
}
