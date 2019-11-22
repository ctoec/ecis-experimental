using Xunit;
using Hedwig.Repositories;
using Hedwig.Models;
using HedwigTests.Fixtures;
using HedwigTests.Helpers;

namespace HedwigTests.Repositories
{
    public class PermissionRepositoryTests
    {
        [Fact]
        public void UserCanAccessSite_SitePermission()
        {
            using( var context = new TestContextProvider().Context) {
                // If user exists with site permission
                var user = UserHelper.CreateUser(context);
                var site = SiteHelper.CreateSite(context);
                PermissionHelper.CreateSitePermission(context, user, site);

                // When repository is queried for user access to site
                var permissionRepo = new PermissionRepository(context);
                var res = permissionRepo.UserCanAccessSite(user.Id, site.Id);

                // Then result is true
                Assert.True(res);
            } 
        }

        [Fact]
        public void UserCanAccessSite_OrganizationPermission()
        {
            using( var context = new TestContextProvider().Context) {
                // If user exists with organization permission that includes site
                var user = UserHelper.CreateUser(context);
                var site = SiteHelper.CreateSite(context);
                var organization = OrganizationHelper.CreateOrganization(context, sites: new Site[]{site});
                PermissionHelper.CreateOrganizationPermission(context, user, organization);

                // When repository is queried for user access to site
                var permissionRepo = new PermissionRepository(context);
                var res = permissionRepo.UserCanAccessSite(user.Id, site.Id);

                // Then result is true
                Assert.True(res);
            } 
        }
        
        [Fact]
        public void UserCanAccessSite_No_Permission()
        {
            using( var context = new TestContextProvider().Context) {
                // If user exists without any permissions
                var user = UserHelper.CreateUser(context);
                var site = SiteHelper.CreateSite(context);
                PermissionHelper.CreateSitePermission(context, user, site);

                // When repository is queried for user access to some other site
                var permissionRepo = new PermissionRepository(context);
                var res = permissionRepo.UserCanAccessSite(user.Id, 0);

                // Then result is false
                Assert.False(res);
            } 
        }


    }
}