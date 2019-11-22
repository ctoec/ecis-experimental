using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
    public class SiteRepository : HedwigRepository, ISiteRepository
    {

        public SiteRepository(HedwigContext context) : base(context) {}

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
            var organizationPermissions = await permissions
                .OfType<OrganizationPermission>()
                .Include(p => p.Organization)
                    .ThenInclude(o => o.Sites)
                .ToListAsync();

            var sitePermissions = await permissions
                .OfType<SitePermission>()
                .Include(p => p.Site)
                .ToListAsync();

            var sites = organizationPermissions.SelectMany(p => p.Organization.Sites)
                .Concat(sitePermissions.Select(p => p.Site))
                .Distinct();

            return sites;
        }

        public async Task<Site> GetSiteByIdAsync(int id)
        {
            return await _context.Sites.SingleOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IDictionary<int, Site>> GetSitesByIdsAsync(IEnumerable<int> ids)
        {
            var dict = await _context.Sites
                .Where(s => ids.Contains(s.Id))
                .ToDictionaryAsync(x => x.Id);
            return dict as IDictionary<int, Site>;
        }
    }

    public interface ISiteRepository
    {
        Task<ILookup<int, Site>> GetSitesByOrganizationIdsAsync(IEnumerable<int> organizationIds);
        Task<IEnumerable<Site>> GetSitesByUserIdAsync(int userId);
        Task<Site> GetSiteByIdAsync(int id);
        Task<IDictionary<int, Site>> GetSitesByIdsAsync(IEnumerable<int> ids);
    }
}
