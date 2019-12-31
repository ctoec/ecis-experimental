using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Controllers;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class EnrollmentRepository : HedwigRepository, IEnrollmentRepository
	{
		public EnrollmentRepository(HedwigContext context) : base(context) { }

		public void UpdateEnrollment(Enrollment enrollment)
		{
			
			var fundings = enrollment.Fundings;
			if (fundings != null)
			{
				var currentFundings = _context.Fundings.AsNoTracking().Where(f => f.EnrollmentId == enrollment.Id).ToList();
				foreach (var currentFunding in currentFundings)
				{
					if (!fundings.Any(f => f.Id == currentFunding.Id))
					{
						_context.Fundings.Remove(currentFunding);
					}
				}

				foreach (var funding in fundings)
				{
					var dbFunding = _context.Fundings.AsNoTracking().SingleOrDefault(f => f.Id == funding.Id);
					if (dbFunding != null)
					{
						_context.Update(funding);
					}
					else
					{
						_context.Fundings.Add(funding);
					}
				}
			}
      _context.Update(enrollment);
		}

		public void AddEnrollment(Enrollment enrollment)
		{
			_context.Add(enrollment);
		}

		public Task<List<Enrollment>> GetEnrollmentsForSiteAsync(
      int siteId,
      DateTime? from = null,
      DateTime? to = null,
      string[] include = null)
    {
      var enrollments = _context.Enrollments
        .FilterByDates(from, to)
        .Where(e => e.SiteId == siteId);


      include = include ?? new string[] { };
      if (include.Contains(INCLUDE_SITES))
      {
        enrollments = enrollments.Include(e => e.Site);
      }

      if (include.Contains(INCLUDE_FUNDINGS))
      {
        enrollments = enrollments.Include(e => e.Fundings)
            .ThenInclude(f => f.FirstReportingPeriod)
          .Include(e => e.Fundings)
            .ThenInclude(f => f.LastReportingPeriod);
      }

      if (include.Contains(INCLUDE_CHILD))
      {
        enrollments = enrollments.Include(e => e.Child);

        if (include.Contains(INCLUDE_FAMILY))
        {
          enrollments = ((IIncludableQueryable<Enrollment, Child>)enrollments).ThenInclude(c => c.Family);

          if (include.Contains(INCLUDE_DETERMINATIONS))
          {
            enrollments = ((IIncludableQueryable<Enrollment, Family>)enrollments).ThenInclude(f => f.Determinations);
          }
        }
      }

      return enrollments.ToListAsync();
    }

    public Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId, string[] include)
    {
      var enrollment = _context.Enrollments
        .Where(e => e.SiteId == siteId
          && e.Id == id);

      include = include ?? new string[] { };

      if (include.Contains(INCLUDE_FUNDINGS))
      {
        enrollment = enrollment.Include(e => e.Fundings);
      }

			if(include.Contains(INCLUDE_SITES))
			{
				enrollment = enrollment.Include(e => e.Site);
			}

      if (include.Contains(INCLUDE_CHILD))
      {
        enrollment = enrollment.Include(e => e.Child);

        if (include.Contains(INCLUDE_FAMILY))
        {
          enrollment = ((IIncludableQueryable<Enrollment, Child>)enrollment).ThenInclude(c => c.Family);

          if (include.Contains(INCLUDE_DETERMINATIONS))
          {
            enrollment = ((IIncludableQueryable<Enrollment, Family>)enrollment).ThenInclude(f => f.Determinations);
          }
        }
      }
      return enrollment.FirstOrDefaultAsync();
    }
  }

  public interface IEnrollmentRepository : IHedwigRepository 
  {
    void UpdateEnrollment(Enrollment enrollment);
    void AddEnrollment(Enrollment enrollment);
    Task<List<Enrollment>> GetEnrollmentsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, string[] include = null);
    Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId, string[] include = null);
  }

  public static class EnrollmentQueryExtensions
  {
    public static IQueryable<Enrollment> FilterByDates(this IQueryable<Enrollment> query, DateTime? from, DateTime? to)
    {
      if (from.HasValue && to.HasValue)
      {
        return query.Where(e => (
          (e.Exit != null && e.Entry <= to && e.Exit >= from)
          ||
          (e.Exit == null && e.Entry <= to)
          ||
          (e.Entry == null)
        ));
      }

      return query;
    }
  }
}
