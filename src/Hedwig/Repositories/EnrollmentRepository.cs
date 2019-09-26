using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class EnrollmentRepository : IEnrollmentRepository
	{
		private readonly HedwigContext _context;

		public EnrollmentRepository(HedwigContext context) => _context = context;

		/// <summary>
		/// This method returns a queryable object to apply filtering to.
		/// </summary>
		public IQueryable<Enrollment> GetQuery()
		{
			return _context.Enrollments;
		}

		/// <summary>
		/// This method filters a query for enrollments by start and end dates.
		/// It returns a queryable object. 
		/// </summary>
		public IQueryable<Enrollment> FilterByDates(IQueryable<Enrollment> query, DateTime from, DateTime to)
		{
			return query.Where(e => (
				(e.Exit != null && e.Entry <= to && e.Exit >= from)
				||
				(e.Exit == null && e.Entry >= from && e.Entry <= to)
			));
		}

		/// <summary>
		/// Complete query be returning enrollments with supplied site ids.
		/// </summary>
		public async Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(IQueryable<Enrollment> query, IEnumerable<int> siteIds)
		{
			var enrollments = await query.Where(e => siteIds.Contains(e.SiteId)).ToListAsync();
			return enrollments.ToLookup(x => x.SiteId);
		}

		public Task<Enrollment> GetEnrollmentByIdAsync(int id) => _context.Enrollments.SingleOrDefaultAsync(e => e.Id == id);
	}

	public interface IEnrollmentRepository
	{
		IQueryable<Enrollment> GetQuery();
		IQueryable<Enrollment> FilterByDates(IQueryable<Enrollment> query, DateTime from, DateTime to);
		Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(IQueryable<Enrollment> query, IEnumerable<int> siteIds);
		Task<Enrollment> GetEnrollmentByIdAsync(int id);
	}
}
