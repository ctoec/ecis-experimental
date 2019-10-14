using System;
using System.Linq;
using System.Collections.Generic;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
  public class SitePermissionHelper
  {
    public static SitePermission CreateSitePermission(
      HedwigContext context,
      User user = null,
      Site site = null
    )
    {
      user = user ?? UserHelper.CreateUser(context);
      site = site ?? SiteHelper.CreateSite(context);

      var sitePermission = new SitePermission
      {
        SiteId = site.Id,
        UserId = user.Id
      };
      context.SitePermissions.Add(sitePermission);
      context.SaveChanges();
      return sitePermission;
    }
  }
}
