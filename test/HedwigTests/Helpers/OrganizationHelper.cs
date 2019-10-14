using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
  public class OrganizationHelper
  {
    public static Organization CreateOrganization(
      HedwigContext context,
      string name = "Test Organization",
      Site[] sites = null
    )
    {
      sites = sites ?? new Site[] { SiteHelper.CreateSite(context) };

      var organization = new Organization { Name = name, Sites = sites };
      context.Organizations.Add(organization);
      context.SaveChanges();
      return organization;
    }
  }
}
