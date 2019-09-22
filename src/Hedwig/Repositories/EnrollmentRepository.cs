using Microsoft.EntityFrameworkCore;
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

		public async Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(IEnumerable<int> siteIds)
		{
			var enrollments = await _context.Enrollments.Where(e => siteIds.Contains(e.SiteId)).ToListAsync();
			return enrollments.ToLookup(x => x.SiteId);
		}

		public Task<Enrollment> GetEnrollmentByIdAsync(int id) => _context.Enrollments.SingleOrDefaultAsync(e => e.Id == id);
	}

	public interface IEnrollmentRepository
	{
		Task<ILookup<int, Enrollment>> GetEnrollmentsBySiteIdsAsync(IEnumerable<int> siteIds);
		Task<Enrollment> GetEnrollmentByIdAsync(int id);
	}
}
