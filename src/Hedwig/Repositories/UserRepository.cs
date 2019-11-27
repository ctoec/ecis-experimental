using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class UserRepository : HedwigRepository, IUserRepository
	{

		public UserRepository(HedwigContext context) : base(context) { }

		public async Task<User> GetUserByIdAsync(int id)
		{
			return await _context.Users
				.Include(u => u.OrgPermissions)
				.ThenInclude(op => op.Organization)
					.ThenInclude(o => o.Sites)
				.Include(u => u.SitePermissions)
					.ThenInclude(sp => sp.Site)
				.SingleOrDefaultAsync(u => u.Id == id);
		}
	}

	public interface IUserRepository
	{
		Task<User> GetUserByIdAsync(int id);
	}
}
