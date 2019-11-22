using System.Threading.Tasks;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
    public class PermissionRepository : HedwigRepository, IPermissionRepository
    {
        public PermissionRepository(HedwigContext context) : base(context) {}
        public bool UserCanAccessSite(int userId, int siteId)
        {
            // User can access site if:
            // - Site permission exists for user for site
            // - Organization permission exists for user for organization that includes site 

            var sitePermissions = _context.Permissions
                .OfType<SitePermission>()
                .Where(sp => sp.UserId == userId && sp.SiteId == siteId)
                .FirstOrDefault();
            
            if(sitePermissions != null) return true;

            var organizationPermissions = _context.Permissions
                .OfType<OrganizationPermission>()
                    .Include(op => op.Organization)
                        .ThenInclude(o => o.Sites)
                .Where(op => op.UserId == userId
                    && op.Organization.Sites.Any(s => s.Id == siteId))
                .FirstOrDefault();


            return organizationPermissions != null;
        }

        public bool UserCanAccessOrganization(int userId, int organizationId)
        {
            // User can access organization if:
            // - Organization permission exists for user for organization
            var organizationPermission = _context.Permissions
                .OfType<OrganizationPermission>()
                .Where(op => op.UserId == userId && op.OrganizationId == organizationId)
                .FirstOrDefault();
                
            return organizationPermission != null;
        }
    }

    public interface IPermissionRepository
    {
        bool UserCanAccessSite(int userId, int siteId);
        bool UserCanAccessOrganization(int userId, int organizationId);
    }
}