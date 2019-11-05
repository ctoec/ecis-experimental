using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class EnrollmentRepository : TemporalRepository, IEnrollmentRepository
	{
		public EnrollmentRepository(HedwigContext context) : base(context) {}

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

		public async Task<Enrollment> GetEnrollmentByIdAsync(int id, DateTime? asOf = null) {
			return await GetBaseQuery<Enrollment>(asOf)
				.SingleOrDefaultAsync(e => e.Id == id);
		}
	}

	public interface IEnrollmentRepository
	{
		Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(
			IEnumerable<int> siteIds,
			DateTime? asOf = null,
			DateTime? from = null,
			DateTime? to = null
		);
		Task<Enrollment> GetEnrollmentByIdAsync(int id, DateTime? asOf = null);
	}

	public static class EnrollmentQueryExtensions
	{
		public static IQueryable<Enrollment> FilterByDates(this IQueryable<Enrollment> query, DateTime? from, DateTime? to)
		{
			if (from.HasValue && to.HasValue){
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
