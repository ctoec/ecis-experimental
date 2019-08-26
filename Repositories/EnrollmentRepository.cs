using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ecis2.Models;
using ecis2.Data;

namespace ecis2.Repositories
{
	public class EnrollmentRepository : IEnrollmentRepository
	{
		private readonly EcisContext _context;

		public EnrollmentRepository(EcisContext context) => _context = context;

		public async Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(IEnumerable<int> siteIds)
		{
			var enrollments = await _context.Enrollments.Where(e => siteIds.Contains(e.SiteId)).ToListAsync();
			return enrollments.ToLookup(x => x.SiteId);
		}
	}

	public interface IEnrollmentRepository
	{
		Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(IEnumerable<int> siteIds);
	}
}
