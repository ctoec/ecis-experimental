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
	public class EnrollmentRepository : HedwigRepository, IEnrollmentRepository
	{
		public EnrollmentRepository(HedwigContext context) : base(context) { }

		public Enrollment GetEnrollmentById(int id)
		{
			return _context.Enrollments.SingleOrDefault(e => e.Id == id);
		}

		public void UpdateEnrollment(Enrollment enrollment)
		{
      var currentFundings = _context.Fundings.AsNoTracking().Where(f => f.EnrollmentId == enrollment.Id).ToList();
			var newFundings = enrollment.Fundings.AsEnumerable().Cast<IHedwigIdEntity<int>>();
			var oldFundings = currentFundings.AsEnumerable().Cast<IHedwigIdEntity<int>>();
			UpdateEnumerableChildObjects(newFundings, oldFundings);
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
			var enrollmentQuery = _context.Enrollments
				.Where(e => e.SiteId == siteId
					&& e.Id == id);

			include = include ?? new string[] { };

			if (include.Contains(INCLUDE_FUNDINGS))
			{
				enrollmentQuery = enrollmentQuery.Include(e => e.Fundings)
						.ThenInclude(f => f.FirstReportingPeriod)
					.Include(e => e.Fundings)
						.ThenInclude(f => f.LastReportingPeriod);
			}

			if(include.Contains(INCLUDE_SITES))
			{
				enrollmentQuery = enrollmentQuery.Include(e => e.Site);
			}

			if (include.Contains(INCLUDE_CHILD))
			{
				enrollmentQuery = enrollmentQuery.Include(e => e.Child);

				if (include.Contains(INCLUDE_FAMILY))
				{
					enrollmentQuery = ((IIncludableQueryable<Enrollment, Child>)enrollmentQuery).ThenInclude(c => c.Family);

					if (include.Contains(INCLUDE_DETERMINATIONS))
					{
						enrollmentQuery = ((IIncludableQueryable<Enrollment, Family>)enrollmentQuery).ThenInclude(f => f.Determinations);
					}
				}
			}

			/** Author is needed to display metadata about enrollment updates
				* However, simply including Author via enrollmentQuery.Include(e => e.Author) includes author
				* on all sub-objects (child, family, familyDetermination, funding). If the same author entity is
				* associated with multiple objects in a single update, the DB update fails with:
				* "System.InvalidOperationException: The instance of entity type 'User' cannot be tracked because another instance with the same key value for {'Id'} is already being tracked."
				* A better solution for this will probably need to be determined, but for now, including un-tracked author on the enrollment ensures there is no clash. 
				*/
			var enrollment = enrollmentQuery.FirstOrDefault();
			var author = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == enrollment.AuthorId);
			enrollment.Author = author;
			return Task.FromResult(enrollment);
		}

		public async Task<List<Enrollment>> GetEnrollmentsForOrganizationAsync(
			int orgId,
			DateTime? from = null,
			DateTime? to = null,
			string[] include = null,
			DateTime? asOf = null
		)
		{
			var enrollments = 
				(asOf != null ? _context.Enrollments.AsOf((DateTime)asOf) : _context.Enrollments)
				.FilterByDates(from, to)
				.Where(e => e.Site.OrganizationId == orgId);

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
			return await enrollments.ToListAsync();
		}

		public void DeleteEnrollment(Enrollment enrollment)
		{
			_context.Enrollments.Remove(enrollment);
		}
	}

	public interface IEnrollmentRepository : IHedwigRepository 
	{
		void UpdateEnrollment(Enrollment enrollment);
		void AddEnrollment(Enrollment enrollment);
		Task<List<Enrollment>> GetEnrollmentsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, string[] include = null);
		Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId, string[] include = null);
		Task<List<Enrollment>> GetEnrollmentsForOrganizationAsync(int orgId, DateTime? from = null, DateTime? to = null, string[] include = null, DateTime? asOf = null);
		Enrollment GetEnrollmentById(int id);

		void DeleteEnrollment(Enrollment enrollment);
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
