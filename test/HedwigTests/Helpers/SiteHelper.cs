using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class SiteHelper
	{
		public static Site CreateSite(HedwigContext context, string name = "Test Site")
		{
			var site = new Site { Name = name };
			context.Sites.Add(site);
			context.SaveChanges();
			return site;
		}
	}
}
