using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class FamilyRepository : IFamilyRepository
	{
		private readonly HedwigContext _context;

		public FamilyRepository(HedwigContext context) => _context = context;

		public async Task<IDictionary<int, Family>> GetFamiliesByIdsAsync(IEnumerable<int> ids)
		{
			var dict = await _context.Families.Where(f => ids.Contains(f.Id)).ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<int, Family>;
		}
	}

	public interface IFamilyRepository
	{
		Task<IDictionary<int, Family>> GetFamiliesByIdsAsync(IEnumerable<int> ids);
	}
}
