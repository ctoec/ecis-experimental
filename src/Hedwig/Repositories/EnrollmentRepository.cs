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

			enrollments = enrollments.ProcessInclude(include);

			return enrollments.ToListAsync();
		}

		public Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId, string[] include)
		{
			var enrollment = _context.Enrollments
				.Where(e => e.SiteId == siteId && e.Id == id);

			enrollment = enrollment.Include(e => e.Author);
			enrollment = enrollment.ProcessInclude(include);

			return enrollment.FirstOrDefaultAsync();
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
			enrollments = enrollments.ProcessInclude(include);
			return await enrollments.ToListAsync();
		}

		public List<Enrollment> GetEnrollmentsByChildId(Guid childId)
		{
			return _context.Enrollments
				.Where(e => e.ChildId == childId)
				.ToList();
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
		List<Enrollment> GetEnrollmentsByChildId(Guid childId);

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

		public static IQueryable<Enrollment> ProcessInclude(this IQueryable<Enrollment> query, string[] include = null)
		{
			include = include ?? new string[] { };
			if (include.Contains(HedwigRepository.INCLUDE_SITES))
			{
				query = query.Include(e => e.Site);
			}

			if (include.Contains(HedwigRepository.INCLUDE_FUNDINGS))
			{
				query = query.Include(e => e.Fundings)
						.ThenInclude(f => f.FirstReportingPeriod)
					.Include(e => e.Fundings)
						.ThenInclude(f => f.LastReportingPeriod);
			}

			if (include.Contains(HedwigRepository.INCLUDE_CHILD))
			{
				query = query.Include(e => e.Child);

				if (include.Contains(HedwigRepository.INCLUDE_FAMILY))
				{
					query = ((IIncludableQueryable<Enrollment, Child>)query).ThenInclude(c => c.Family);

					if (include.Contains(HedwigRepository.INCLUDE_DETERMINATIONS))
					{
						query = ((IIncludableQueryable<Enrollment, Family>)query).ThenInclude(f => f.Determinations);
					}
				}
			}

			return query;
		}
	}
}
