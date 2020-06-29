using System;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;
using Microsoft.EntityFrameworkCore;

namespace Hedwig.Repositories
{
	public class UserRepository : HedwigRepository, IUserRepository
	{

		public UserRepository(HedwigContext context) : base(context) { }

		public User GetUserById(int id)
		{
			return _context.Users
				.Include(u => u.OrgPermissions)
					.ThenInclude(op => op.Organization)
						.ThenInclude(o => o.Sites)
				.Include(u => u.SitePermissions)
					.ThenInclude(sp => sp.Site)
				.SingleOrDefault(u => u.Id == id);
		}

		public User GetUserByWingedKeysId(Guid id)
		{
			return _context.Users
			.Include(u => u.OrgPermissions)
				.ThenInclude(op => op.Organization)
					.ThenInclude(o => o.Sites)
				.Include(u => u.SitePermissions)
					.ThenInclude(sp => sp.Site)
			.SingleOrDefault(u => u.WingedKeysId == id);
		}

	}

	public interface IUserRepository
	{
		User GetUserById(int id);
		User GetUserByWingedKeysId(Guid id);
	}
}
