using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ecis2.Models;
using ecis2.Data;

namespace ecis2.Repositories
{
	public class SiteRepository : ISiteRepository
	{
		private readonly EcisContext _context;

		public SiteRepository(EcisContext context) => _context = context;

		public async Task<IEnumerable<Site>> GetSitesByUserIdAsync(int userId)
		{
			var permissions = await _context.SitePermissions.Include(p => p.Site).Where(p => userId == p.UserId).ToListAsync();
			var sites = permissions.Select(s => s.Site);
			return sites;
		}
	}

	public interface ISiteRepository
	{
		Task<IEnumerable<Site>> GetSitesByUserIdAsync(int userId);
	}
}
