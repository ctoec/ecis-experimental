using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ecis2.Models;
using ecis2.Data;

namespace ecis2.Repositories
{
	public class FamilyDeterminationRepository : IFamilyDeterminationRepository
	{
		private readonly EcisContext _context;

		public FamilyDeterminationRepository(EcisContext context) => _context = context;

		public async Task<ILookup<int, FamilyDetermination>> GetDeterminationsByFamilyIdsAsync(IEnumerable<int> familyIds)
		{
			var determinations = await _context.FamilyDeterminations.Where(d => familyIds.Contains(d.FamilyId)).ToListAsync();
			return determinations.ToLookup(x => x.FamilyId);
		}
	}

	public interface IFamilyDeterminationRepository
	{
		Task<ILookup<int, FamilyDetermination>> GetDeterminationsByFamilyIdsAsync(IEnumerable<int> familyIds);
	}
}
