using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Hedwig.Repositories;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
    public class SiteRepositoryTests
    {
        [Fact]
        public async Task Get_Sites_By_User_Id()
        {
            using (var context = new TestContextProvider().Context) {
                // If site permissions exist with user Ids
                var user1 = UserHelper.CreateUser(context);
                var sitePermissionUser1 = SitePermissionHelper.CreateSitePermissionWithUserId(context, user1.Id);
                var user2 = UserHelper.CreateUser(context);
                var sitePermission1User2 = SitePermissionHelper.CreateSitePermissionWithUserId(context, user2.Id);
                var sitePermission2User2 = SitePermissionHelper.CreateSitePermissionWithUserId(context, user2.Id);

                // When the site repository is queried with a user id
                var siteRepo = new SiteRepository(context);
                var res = await siteRepo.GetSitesByUserIdAsync(user2.Id);

                // Then a list of sites for which that user has permission is returned
                var siteIds = (from s in res
                                select s.Id).OrderBy(id => id);
                Assert.Equal(new int[]{ sitePermission1User2.Id, sitePermission2User2.Id }, siteIds);
            }
        }
    }
}