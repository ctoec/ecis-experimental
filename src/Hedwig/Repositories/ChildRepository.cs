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

	public async Task<IDictionary<Guid, ICollection<Enrollment>>> GetChildrenIdToEnrollmentsForOrganizationAsync(
		int organizationId,
		int reportId,
		DateTime? from = null,
		DateTime? to = null,
		string[] include = null
	)
	{
	  var childrenSet = _context.Children;
	  var enrollmentsSet = _context.Enrollments;
	  var children = childrenSet.AsQueryable();
	  var enrollments = enrollmentsSet.AsQueryable();

	  // Prepare asOf if necessary
	  var report = _context.Reports.Where(r => r.Id == reportId).SingleOrDefault();
	  if (report != null && report.SubmittedAt.HasValue)
	  {
		children = childrenSet.AsOf(report.SubmittedAt.Value);
		enrollments = enrollmentsSet.AsOf(report.SubmittedAt.Value);
	  }

	  // Get IDs of children in given Organization
	  var childrenIdsForOrganization = await children
		  .Where(c => c.OrganizationId == organizationId)
		  .Select(c => c.Id)
		  .ToListAsync();

	  // Get IDs of children with
	  // enrollments in any sites in the given organization
	  // filtered by given dates
	  var childIds = await enrollments
		  .FilterByDates(from, to)
		  .Where(e => childrenIdsForOrganization.Contains(e.ChildId))
		  .Select(e => e.ChildId)
		  .ToListAsync();

	  var childrenQuery = children
		  .Include(c => c.Enrollments)
		  .ThenInclude(e => e.Fundings)
		  .Where(c => childIds.Contains(c.Id));

	  include = include ?? new string[] { };
	  if (include.Contains(INCLUDE_FAMILY))
	  {
		childrenQuery = childrenQuery.Include(c => c.Family);

		if (include.Contains(INCLUDE_DETERMINATIONS))
		{
		  childrenQuery = ((IIncludableQueryable<Child, Family>)childrenQuery).ThenInclude(f => f.Determinations);
		}
	  }
	  return await childrenQuery.ToDictionaryAsync(c => c.Id, c => c.Enrollments);
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
	Task<IDictionary<Guid, ICollection<Enrollment>>> GetChildrenIdToEnrollmentsForOrganizationAsync(
		int organizationId,
		int reportId,
		DateTime? from = null,
		DateTime? to = null,
		string[] include = null
	);
	Task<Child> GetChildForOrganizationAsync(Guid id, int organizationId, string[] include);
	Child GetChildById(Guid id);
  }
}
