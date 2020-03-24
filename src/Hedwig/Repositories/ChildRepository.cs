using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class ChildRepository : HedwigRepository, IChildRepository
	{
		public ChildRepository(HedwigContext context) : base(context) { }

		public async Task<List<Child>> GetChildrenForOrganizationAsync(
			int organizationId,
			string[] include = null
		)
		{
			var children = _context.Children
				.Where(c => c.OrganizationId == organizationId);

			include = include ?? new string[] { };
			if (include.Contains(INCLUDE_FAMILY))
			{
				children = children.Include(c => c.Family);

				if (include.Contains(INCLUDE_DETERMINATIONS))
				{
					children = ((IIncludableQueryable<Child, Family>)children).ThenInclude(f => f.Determinations);
				}
			}
			return await children.ToListAsync();
		}

		public Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId, string[] include = null)
		{
			var child = _context.Children
				.Where(c => c.Id == id
					&& c.OrganizationId == organizationId
				);
			include = include ?? new string[] { };
			if (include.Contains(INCLUDE_FAMILY))
			{
				child = child.Include(c => c.Family);

				if (include.Contains(INCLUDE_DETERMINATIONS))
				{
					child = ((IIncludableQueryable<Child, Family>)child).ThenInclude(f => f.Determinations);
				}
			}

			return child.FirstOrDefaultAsync();
		}
		public Child GetChildById(Guid id)
		{
			return _context.Children
				.AsNoTracking()
				.Single(c => c.Id == id);
		}
	}

	public interface IChildRepository
	{
		Task<List<Child>> GetChildrenForOrganizationAsync(
			int organizationId,
			string[] include = null
		);
		Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId, string[] include);
		Child GetChildById(Guid id);
	}
}
