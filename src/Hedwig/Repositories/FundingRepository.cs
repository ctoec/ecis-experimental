using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using System;

namespace Hedwig.Repositories
{
	public class FundingRepository : TemporalRepository, IFundingRepository
	{

		public FundingRepository(HedwigContext context) : base(context) {}

		public async Task<ILookup<int, Funding>> GetFundingsByEnrollmentIdsAsync(IEnumerable<int> enrollmentIds, DateTime? asOf = null)
		{
			var fundings = await GetBaseQuery<Funding>(asOf)
				.Where(f => enrollmentIds.Contains(f.EnrollmentId))
				.ToListAsync();
			return fundings.ToLookup(x => x.EnrollmentId);
		}
	}

	public interface IFundingRepository
	{
		Task<ILookup<int, Funding>> GetFundingsByEnrollmentIdsAsync(IEnumerable<int> enrollmentIds, DateTime? asOf = null);
	}
}
