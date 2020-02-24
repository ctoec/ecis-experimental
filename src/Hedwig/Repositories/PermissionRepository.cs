using System;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
  public class PermissionRepository : HedwigRepository, IPermissionRepository
  {
	public PermissionRepository(HedwigContext context) : base(context) { }
	public bool UserCanAccessSite(Guid externalUserId, int siteId)
	{
	  var user = _context.Users
		  .AsNoTracking()
		  .FirstOrDefault(u => u.WingedKeysId == externalUserId);

	  // User can access site if:
	  // - Site permission exists for user for site
	  // - Organization permission exists for user for organization that includes site 
	  var sitePermissions = _context.Permissions
		  .AsNoTracking()
		  .OfType<SitePermission>()
		  .Where(sp => sp.UserId == user.Id && sp.SiteId == siteId)
		  .FirstOrDefault();

	  if (sitePermissions != null) return true;

	  var organizationPermissions = _context.Permissions
		  .AsNoTracking()
		  .OfType<OrganizationPermission>()
			  .Include(op => op.Organization)
				  .ThenInclude(o => o.Sites)
		  .Where(op => op.UserId == user.Id
			  && op.Organization.Sites.Any(s => s.Id == siteId))
		  .FirstOrDefault();


	  return organizationPermissions != null;
	}

	public bool UserCanAccessOrganization(Guid externalUserId, int organizationId)
	{
	  var user = _context.Users
		  .AsNoTracking()
		  .FirstOrDefault(u => u.WingedKeysId == externalUserId);
	  // User can access organization if:
	  // - Organization permission exists for user for organization
	  var organizationPermission = _context.Permissions
		  .AsNoTracking()
		  .OfType<OrganizationPermission>()
		  .Where(op => op.UserId == user.Id && op.OrganizationId == organizationId)
		  .FirstOrDefault();

	  return organizationPermission != null;
	}
  }

  public interface IPermissionRepository
  {
	bool UserCanAccessSite(Guid externalUserId, int siteId);
	bool UserCanAccessOrganization(Guid externalUserId, int organizationId);
  }
}
