using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace Hedwig.Repositories
{
	public class SiteRepository : HedwigRepository, ISiteRepository
	{

		public SiteRepository(HedwigContext context) : base(context) { }

		public Task<Site> GetSiteForOrganizationAsync(int id, int organizationId)
		{
			var site = _context.Sites
				.Where(s => s.Id == id
					&& s.OrganizationId == organizationId);

			site = site.Include(s => s.Organization);

			site = ((IIncludableQueryable<Site, Organization>)site)
				.ThenInclude(o => o.FundingSpaces)
					.ThenInclude(fs => fs.TimeSplit);

			site = site.Include(s => s.Enrollments)
				.ThenInclude(e => e.Fundings)
					.ThenInclude(f => f.FirstReportingPeriod)
			.Include(s => s.Enrollments)
				.ThenInclude(e => e.Fundings)
					.ThenInclude(f => f.LastReportingPeriod);

			return site.FirstOrDefaultAsync();
		}

		public List<Site> GetSitesByOrganizationId(int organizationId)
		{
			return _context.Sites
				.Where(s => s.OrganizationId == organizationId)
				.ToList();
		}


		public Site GetSiteById(int id)
		{
			return _context.Sites.FirstOrDefault(site => site.Id == id);
		}
	}

	public interface ISiteRepository
	{
		Task<Site> GetSiteForOrganizationAsync(int id, int organizationId);
		List<Site> GetSitesByOrganizationId(int organizationId);
		Site GetSiteById(int id);
	}
}
