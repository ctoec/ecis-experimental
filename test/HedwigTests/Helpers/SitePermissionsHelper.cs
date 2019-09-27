using System;
using System.Linq;
using System.Collections.Generic;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
    public class SitePermissionHelper
    {
        public static SitePermission CreateSitePermission(HedwigContext context)
        {
            var user = UserHelper.CreateUser(context);
            var site = SiteHelper.CreateSite(context);
            var sitePermission = new SitePermission {
                UserId = user.Id,
                SiteId = site.Id,
            };
            context.SitePermissions.Add(sitePermission);
            context.SaveChanges();
            return sitePermission;
        }

        public static SitePermission CreateSitePermissionWithUserId(HedwigContext context, int UserId)
        {
            var site = SiteHelper.CreateSite(context);
            var sitePermission = new SitePermission {
                SiteId = site.Id,
                UserId = UserId
            };
            context.SitePermissions.Add(sitePermission);
            context.SaveChanges();
            return sitePermission;
        }
    }
}