using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class FamilyDeterminationRepository : TemporalRepository, IFamilyDeterminationRepository
	{
		public FamilyDeterminationRepository(HedwigContext context) : base(context) {}

		public async Task<ILookup<int, FamilyDetermination>> GetDeterminationsByFamilyIdsAsync(IEnumerable<int> familyIds, DateTime? asOf = null)
		{
			var determinations = await GetBaseQuery<FamilyDetermination>(asOf)
				.Where(d => familyIds.Contains(d.FamilyId))
				.ToListAsync();

			return determinations.ToLookup(d => d.FamilyId);
		}
	}

	public interface IFamilyDeterminationRepository
	{
		Task<ILookup<int, FamilyDetermination>> GetDeterminationsByFamilyIdsAsync(IEnumerable<int> familyIds, DateTime? asOf = null);
	}
}
