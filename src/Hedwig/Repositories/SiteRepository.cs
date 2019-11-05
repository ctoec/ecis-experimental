using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class SiteRepository : ISiteRepository
	{
		private readonly HedwigContext _context;

		public SiteRepository(HedwigContext context) => _context = context;

		public async Task<ILookup<int, Site>> GetSitesByOrganizationIdsAsync(IEnumerable<int> organizationIds)
		{
			var sites = await _context.Sites
				.Where(s => s.OrganizationId.HasValue && organizationIds.Contains(s.OrganizationId.Value))
				.ToListAsync();
			return sites.ToLookup(x => x.OrganizationId.Value);
		}

		public async Task<IEnumerable<Site>> GetSitesByUserIdAsync(int userId)
		{
			var permissions = _context.Permissions.Where(p => userId == p.UserId);

			// If a user has permission for an organization, they have permissions for all of its child sites
			var organizationPermissions = permissions
				.OfType<OrganizationPermission>()
				.Include(p => p.Organization)
					.ThenInclude(o => o.Sites)
				.ToListAsync();

			var sitePermissions = permissions
				.OfType<SitePermission>()
				.Include(p => p.Site)
				.ToListAsync();

			await Task.WhenAll(sitePermissions, organizationPermissions);

			var sites = organizationPermissions.Result.SelectMany(p => p.Organization.Sites)
				.Concat(sitePermissions.Result.Select(p => p.Site))
				.Distinct();

			return sites;
		}

		public async Task<Site> GetSiteByIdAsync(int id)
		{
			return await _context.Sites.SingleOrDefaultAsync(s => s.Id == id);
		}
	}

	public interface ISiteRepository
	{
		Task<ILookup<int, Site>> GetSitesByOrganizationIdsAsync(IEnumerable<int> organizationIds);
		Task<IEnumerable<Site>> GetSitesByUserIdAsync(int userId);
		Task<Site> GetSiteByIdAsync(int id);
	}
}
