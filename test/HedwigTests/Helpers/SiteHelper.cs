using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class SiteHelper
	{
		public const string NAME = "Test Site";

		public static Site CreateSite(HedwigContext context)
		{
			var site = new Site { Name = NAME };			
			context.Sites.Add(site);
			context.SaveChanges();
			return site;
		}
	}
}
