using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class SiteRepository : HedwigRepository, ISiteRepository
	{

		public SiteRepository(HedwigContext context) : base(context) { }

		public Task<List<Site>> GetSitesForOrganizationAsync(int organizationId)
		{
			return _context.Sites
				.Where(s => s.OrganizationId == organizationId)
				.ToListAsync();
		}

		public Task<Site> GetSiteForOrganizationAsync(int id, int organizationId, string[] include = null)
		{
			var site = _context.Sites
				.Where(s => s.Id == id
					&& s.OrganizationId == organizationId);

			include = include ?? new string[] { };
			if (include.Contains(INCLUDE_ORGANIZATIONS))
			{
				site = site.Include(s => s.Organization);

				if (include.Contains(INCLUDE_FUNDING_SPACES))
				{
					site = ((IIncludableQueryable<Site, Organization>)site)
						.ThenInclude(o => o.FundingSpaces)
							.ThenInclude(fs => fs.FundingTimeAllocations);
				}
			}
			// Chaining of multiple ThenIncludes is not supported, so to include both
			// enrollment fundings and enrollment children requires separate calls to include enrollments
			if (include.Contains(INCLUDE_ENROLLMENTS))
			{
				if (include.Contains(INCLUDE_FUNDINGS))
				{
					site = site.Include(s => s.Enrollments)
						.ThenInclude(e => e.Fundings)
							.ThenInclude(f => f.FirstReportingPeriod)
					.Include(s => s.Enrollments)
						.ThenInclude(e => e.Fundings)
							.ThenInclude(f => f.LastReportingPeriod);
				}

				if (include.Contains(INCLUDE_CHILD))
				{
					site = site.Include(s => s.Enrollments).ThenInclude(e => e.Child);
				}

				if (!(include.Contains(INCLUDE_FUNDINGS) || include.Contains(INCLUDE_CHILD)))
				{
					site = site.Include(s => s.Enrollments);
				}
			}

			return site.FirstOrDefaultAsync();
		}

		public Site GetSiteByIdAsNoTracking(int id)
		{
			return _context.Sites.FirstOrDefault(site => site.Id == id);
		}
	}

	public interface ISiteRepository
	{
		Task<List<Site>> GetSitesForOrganizationAsync(int organizationId);
		Task<Site> GetSiteForOrganizationAsync(int id, int organizationId, string[] include = null);
	
		Site GetSiteByIdAsNoTracking(int id);
	}
}
