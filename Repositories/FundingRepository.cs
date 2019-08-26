using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using ecis2.Models;
using ecis2.Data;

namespace ecis2.Repositories
{
	public class FundingRepository : IFundingRepository
	{
		private readonly EcisContext _context;

		public FundingRepository(EcisContext context) => _context = context;

		public async Task<ILookup<int, Funding>> GetFundingsByEnrollmentIdsAsync(IEnumerable<int> enrollmentIds)
		{
			var fundings = await _context.Fundings.Where(f => enrollmentIds.Contains(f.EnrollmentId)).ToListAsync();
			return fundings.ToLookup(x => x.EnrollmentId);
		}
	}

	public interface IFundingRepository
	{
		Task<ILookup<int, Funding>> GetFundingsByEnrollmentIdsAsync(IEnumerable<int> enrollmentIds);
	}
}
