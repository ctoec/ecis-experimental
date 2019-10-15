using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class OrganizationRepository : IOrganizationRepository
	{
		private readonly HedwigContext _context;

		public OrganizationRepository(HedwigContext context) => _context = context;

		public async Task<IDictionary<int, Organization>> GetOrganizationsByIdsAsync(IEnumerable<int> ids)
		{
			var dict = await _context.Organizations
				.Where(o => ids.Contains(o.Id))
				.ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<int, Organization>;
		}
	}

	public interface IOrganizationRepository
	{
		Task<IDictionary<int, Organization>> GetOrganizationsByIdsAsync(IEnumerable<int> ids);
	}
}
