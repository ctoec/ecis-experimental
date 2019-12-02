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
	public class EnrollmentRepository : TemporalRepository, IEnrollmentRepository
	{
		public EnrollmentRepository(HedwigContext context) : base(context) { }

		public void UpdateEnrollment(Enrollment enrollment)
		{
			_context.Entry(enrollment).State = EntityState.Modified;
		}
		public void AddEnrollment(Enrollment enrollment)
		{
			_context.Add(enrollment);
		}

		public Task SaveChangesAsync()
		{
			return _context.SaveChangesAsync();
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
			if (include.Contains(INCLUDE_FUNDINGS))
			{
				enrollments = enrollments.Include(e => e.Fundings);
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
		public async Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(
			IEnumerable<int> siteIds,
			DateTime? asOf = null,
			DateTime? from = null,
			DateTime? to = null)
		{
			var enrollments = await GetBaseQuery<Enrollment>(asOf)
				.FilterByDates(from, to)
				.Where(e => siteIds.Contains(e.SiteId))
				.ToListAsync();
			return enrollments.ToLookup(x => x.SiteId);
		}

		public async Task<ILookup<Guid, Enrollment>> GetEnrollmentsByChildIdsAsync(
			IEnumerable<Guid> childIds,
			DateTime? asOf = null)
		{
			var enrollments = await GetBaseQuery<Enrollment>(asOf)
				.Where(e => childIds.Contains(e.ChildId))
				.ToListAsync();
			return enrollments.ToLookup(x => x.ChildId);
		}

		public async Task<Enrollment> GetEnrollmentByIdAsync(int id, DateTime? asOf = null)
		{
			return await GetBaseQuery<Enrollment>(asOf)
				.SingleOrDefaultAsync(e => e.Id == id);
		}

		public async Task<IDictionary<int, Enrollment>> GetEnrollmentsByIdsAsync(IEnumerable<int> ids, DateTime? asOf = null)
		{
			var dict = await GetBaseQuery<Enrollment>(asOf)
				.Where(e => ids.Contains(e.Id))
				.ToDictionaryAsync(x => x.Id);
			return dict as IDictionary<int, Enrollment>;
		}

		public Enrollment CreateEnrollment(Guid childId, int siteId)
		{
			var enrollment = new Enrollment
			{
				ChildId = childId,
				SiteId = siteId
			};

			_context.Add<Enrollment>(enrollment);
			return enrollment;
		}
	}

	public interface IEnrollmentRepository
	{
		void UpdateEnrollment(Enrollment enrollment);
		void AddEnrollment(Enrollment enrollment);
		Task SaveChangesAsync();
		Task<List<Enrollment>> GetEnrollmentsForSiteAsync(int siteId, DateTime? from = null, DateTime? to = null, string[] include = null);
		Task<Enrollment> GetEnrollmentForSiteAsync(int id, int siteId, string[] include = null);
		Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(
			IEnumerable<int> siteIds,
			DateTime? asOf = null,
			DateTime? from = null,
			DateTime? to = null
		);
		Task<ILookup<Guid, Enrollment>> GetEnrollmentsByChildIdsAsync(
			IEnumerable<Guid> childIds,
			DateTime? asOf = null
		);

		Task<Enrollment> GetEnrollmentByIdAsync(int id, DateTime? asOf = null);
		Task<IDictionary<int, Enrollment>> GetEnrollmentsByIdsAsync(IEnumerable<int> ids, DateTime? asOf = null);
		Enrollment CreateEnrollment(Guid childId, int siteId);
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
				));
			}

			return query;
		}
	}
}
