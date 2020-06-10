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
			int organizationId
		)
		{
			var children = _context.Children
				.Where(c => c.OrganizationId == organizationId);

			children = children.Include(c => c.Family);
      children = ((IIncludableQueryable<Child, Family>)children).ThenInclude(f => f.Determinations);

			return await children.ToListAsync();
		}

		public Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId)
		{
			var child = _context.Children
				.Where(c => c.Id == id
					&& c.OrganizationId == organizationId
				);

			child = child.Include(c => c.Family);
			child = ((IIncludableQueryable<Child, Family>)child).ThenInclude(f => f.Determinations);

			return child.FirstOrDefaultAsync();
		}
		public Child GetChildById(Guid id)
		{
			return _context.Children
				.Single(c => c.Id == id);
		}
	}

	public interface IChildRepository
	{
		Task<List<Child>> GetChildrenForOrganizationAsync(
			int organizationId
		);
		Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId);
		Child GetChildById(Guid id);
	}
}
