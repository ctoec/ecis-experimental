using System.Linq;
using System.Collections.Generic;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
  public class SiteHelper
  {
	public static Site CreateSite(
		HedwigContext context,
		string name = "Test Site",
		Organization organization = null
	)
	{
	  organization = organization ?? OrganizationHelper.CreateOrganization(context);
	  var site = new Site
	  {
		Name = name,
		OrganizationId = organization.Id
	  };
	  context.Sites.Add(site);
	  context.SaveChanges();
	  return site;
	}

	public static List<Site> CreateSites(
		HedwigContext context,
		int numberOfSites,
		Organization organization = null
	)
	{
	  var sites = Enumerable.Range(0, numberOfSites)
		  .Select(i => CreateSite(context, organization: organization))
		  .ToList();

	  return sites;
	}
  }
}
