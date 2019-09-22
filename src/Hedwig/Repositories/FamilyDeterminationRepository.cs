using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class FamilyDeterminationRepository : IFamilyDeterminationRepository
	{
		private readonly HedwigContext _context;

		public FamilyDeterminationRepository(HedwigContext context) => _context = context;

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
