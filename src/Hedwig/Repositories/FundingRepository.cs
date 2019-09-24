using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class FundingRepository : IFundingRepository
	{
		private readonly HedwigContext _context;

		public FundingRepository(HedwigContext context) => _context = context;

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
