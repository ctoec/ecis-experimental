using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class FamilyRepository : TemporalRepository, IFamilyRepository
	{
		public FamilyRepository(HedwigContext context) : base(context) {}

		public Task<List<Family>> GetFamiliesByIdsAsync(IEnumerable<int> ids, bool includeDeterminations = false)
		{
			var families = _context.Families
				.Where(f => ids.Contains(f.Id));

			if(includeDeterminations)
			{
				families = families.Include(f => f.Determinations);
			}

			return families.ToListAsync();
		}

		public Family GetFamilyById(int id)
		{
			var family = _context.Families
				.Where(f => f.Id == id);

			return family.FirstOrDefault();
		}

		public async Task<IDictionary<int, Family>> GetFamiliesByIdsAsync_OLD(IEnumerable<int> ids, DateTime? asOf = null)
		{
			var dict = await GetBaseQuery<Family>(asOf)
				.Where(f => ids.Contains(f.Id))
				.ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<int, Family>;
		}

		public async Task<Family> GetFamilyByIdAsync_OLD(int id, DateTime? asOf = null)
		{
			return await GetBaseQuery<Family>(asOf)
				.FirstOrDefaultAsync(f => f.Id == id);
		}

		public Family CreateFamily(
			string addressLine1 = null,
			string addressLine2 = null,
			string town = null,
			string state = null,
			string zip = null,
			bool homelessness = false)
		{
			var family = new Family {
				AddressLine1 = addressLine1,
				AddressLine2 = addressLine2,
				Town = town,
				State = state,
				Zip = zip,
				Homelessness = homelessness
			};

			_context.Add<Family>(family);
			return family;
		}
	}

	public interface IFamilyRepository
	{
		Task<List<Family>> GetFamiliesByIdsAsync(IEnumerable<int> ids, bool includeDeterminations = false);
		Family GetFamilyById(int id);
		Task<IDictionary<int, Family>> GetFamiliesByIdsAsync_OLD(IEnumerable<int> ids, DateTime? asOf = null);
		Task<Family> GetFamilyByIdAsync_OLD(int id, DateTime? asOf = null);
		Family CreateFamily(
			string addressLine1 = null,
			string addressLine2 = null,
			string town = null,
			string state = null,
			string zip = null,
			bool homelessness = false
		);
	}
}
