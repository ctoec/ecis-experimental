using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using System.Threading;

namespace Hedwig.Repositories
{
	public class ChildRepository : TemporalRepository, IChildRepository
	{
		public ChildRepository(HedwigContext context) : base(context) {}

		public async Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync(IEnumerable<Guid> ids, DateTime? asOf = null)
		{
			var dict = await GetBaseQuery<Child>(asOf)
				.Where(c => ids.Contains(c.Id))
				.ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<Guid, Child>;
		}

		public Task<Child> GetChildByIdAsync(Guid id, DateTime? asOf = null)
		{
			return GetBaseQuery<Child>(asOf)
				.Where(c => c.Id == id)
				.SingleOrDefaultAsync();
		}
	}

	public interface IChildRepository
	{
		Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync(IEnumerable<Guid> ids, DateTime? asOf = null);
		Task<Child> GetChildByIdAsync(Guid id, DateTime? asOf = null);
	}
}
