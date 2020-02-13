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
		public ChildRepository(HedwigContext context) : base(context) {}

		public async Task<IDictionary<Guid, ICollection<Enrollment>>> GetChildrenForOrganizationAsync(
			int organizationId,
			DateTime? from = null,
			DateTime? to = null,
			string[] include = null
		)
		{
			// Get IDs of children in given Organization
			var childrenIdsForOrganization = await _context.Children
				.Where(c => c.OrganizationId == organizationId)
				.Select(c => c.Id)
				.ToListAsync();

			// Get IDs of sites in given organization
			// var siteIdsForOrganization = _context.Sites
			// 	.Where(s => s.OrganizationId == organizationId)
			// 	.Select(s => s.Id)
			// 	.ToList();

			// Get IDs of children with
			// enrollments in any sites in the given organization
			// filtered by given dates
			var childIds = await _context.Enrollments
				.FilterByDates(from, to)
				.Where(e => childrenIdsForOrganization.Contains(e.ChildId))
				.Select(e => e.ChildId)
				.ToListAsync();

			var children = _context.Children
				.Include(c => c.Enrollments)
				.ThenInclude(e => e.Fundings)
				.Where(c => childIds.Contains(c.Id));

			include = include ?? new string[]{};
			if (include.Contains(INCLUDE_FAMILY))
			{
				children = children.Include(c => c.Family);

				if(include.Contains(INCLUDE_DETERMINATIONS))
				{
					children = ((IIncludableQueryable<Child, Family>)children).ThenInclude(f => f.Determinations);
				}
			}

			return await children.ToDictionaryAsync(c => c.Id, c => c.Enrollments);
		}

		public Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId, string[] include = null)
		{
			var child = _context.Children
				.Where(c => c.Id == id 
					&& c.OrganizationId == organizationId
				);
			include = include ?? new string[]{};
			if (include.Contains(INCLUDE_FAMILY))
			{
				child = child.Include(c => c.Family);

				if(include.Contains(INCLUDE_DETERMINATIONS))
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
		Task<IDictionary<Guid, ICollection<Enrollment>>> GetChildrenForOrganizationAsync(
			int organizationId,
			DateTime? from = null,
			DateTime? to = null,
			string[] include = null
		);
		Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId, string[] include);
		Child GetChildById(Guid id);
	}
}
