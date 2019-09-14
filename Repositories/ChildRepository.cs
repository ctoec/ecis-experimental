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
	public class ChildRepository : IChildRepository
	{
		private readonly HedwigContext _context;

		public ChildRepository(HedwigContext context) => _context = context;

		public async Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync(IEnumerable<Guid> ids)
		{
			var dict = await _context.Children.Where(c => ids.Contains(c.Id)).ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<Guid, Child>;
		}
	}

	public interface IChildRepository
	{
		Task<IDictionary<Guid, Child>> GetChildrenByIdsAsync(IEnumerable<Guid> ids);
	}
}
