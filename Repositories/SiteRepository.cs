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
