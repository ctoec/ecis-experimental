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

		public Task<FamilyDetermination> GetDeterminationByIdAsync(int id, DateTime? asOf = null)
		{
			return GetBaseQuery<FamilyDetermination>(asOf)
				.FirstOrDefaultAsync(d => d.Id == id);
		}

		public FamilyDetermination CreateFamilyDetermination(
			int numberOfPeople,
			decimal income,
			DateTime determined,
			int familyId
		)
		{
			var familyDetermination = new FamilyDetermination {
				NumberOfPeople = numberOfPeople,
				Income = income,
				Determined = determined,
				FamilyId = familyId
			};
			_context.Add(familyDetermination);
			return familyDetermination;
		}

		public FamilyDetermination UpdateFamilyDetermination(
			FamilyDetermination determination,
			int? numberOfPeople,
			decimal? income,
			DateTime? determined
		)
		{
			if(numberOfPeople.HasValue) {
				determination.NumberOfPeople = numberOfPeople.Value;
			}

			if(income.HasValue) {
				determination.Income = income.Value;
			}

			if(determined.HasValue) {
				determination.Determined = determined.Value;
			}

			return determination;
		}
	}

	public interface IFamilyDeterminationRepository
	{
		Task<ILookup<int, FamilyDetermination>> GetDeterminationsByFamilyIdsAsync(IEnumerable<int> familyIds, DateTime? asOf = null);
		Task<FamilyDetermination> GetDeterminationByIdAsync(int id, DateTime? asOf = null);
		FamilyDetermination CreateFamilyDetermination(
			int numberOfPeople,
			decimal income,
			DateTime determined,
			int familyId
		);

		FamilyDetermination UpdateFamilyDetermination(
			FamilyDetermination determination,
			int? numberOfPeople = null,
			decimal? income = null,
			DateTime? determined = null
		);
	}
}
