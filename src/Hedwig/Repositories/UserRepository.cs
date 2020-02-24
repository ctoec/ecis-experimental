using System;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
  public class UserRepository : HedwigRepository, IUserRepository
  {

	public UserRepository(HedwigContext context) : base(context) { }

	public Task<User> GetUserByIdAsync(int id)
	{
	  return _context.Users
		  .Include(u => u.OrgPermissions)
			  .ThenInclude(op => op.Organization)
				  .ThenInclude(o => o.Sites)
		  .Include(u => u.SitePermissions)
			  .ThenInclude(sp => sp.Site)
		  .SingleOrDefaultAsync(u => u.Id == id);
	}

	public Task<User> GetUserByWingedKeysIdAsync(Guid id)
	{
	  return _context.Users
	  .Include(u => u.OrgPermissions)
		  .ThenInclude(op => op.Organization)
			  .ThenInclude(o => o.Sites)
		  .Include(u => u.SitePermissions)
			  .ThenInclude(sp => sp.Site)
	  .SingleOrDefaultAsync(u => u.WingedKeysId == id);
	}

  }

  public interface IUserRepository
  {
	Task<User> GetUserByIdAsync(int id);
	Task<User> GetUserByWingedKeysIdAsync(Guid id);
  }
}
