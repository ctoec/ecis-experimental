using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ecis2.Models;
using ecis2.Data;

namespace ecis2.Repositories
{
	public class FamilyRepository : IFamilyRepository
	{
		private readonly EcisContext _context;

		public FamilyRepository(EcisContext context) => _context = context;

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
