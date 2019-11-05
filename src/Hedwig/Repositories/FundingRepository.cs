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

		public Task<Funding> GetFundingByIdAsync(int id, DateTime? asOf = null)
		{
			return GetBaseQuery<Funding>(asOf)
				.FirstOrDefaultAsync(f => f.Id == id);
		}

		public Funding CreateFunding(
			int enrollmentId,
			FundingSource source,
			FundingTime time
		)
		{
			var funding = new Funding {
				EnrollmentId = enrollmentId,
				Source = source,
				Time = time
			};
			
			_context.Add(funding);
			return funding;
		}

		public Funding UpdateFunding(
			Funding funding,
			FundingSource? source = null,
			FundingTime? time = null
		)
		{
			if (source.HasValue) {
				funding.Source = source.Value;
			}

			if (time.HasValue) {
				funding.Time = time.Value;
			}

			return funding;
		}
	}

	public interface IFundingRepository
	{
		Task<ILookup<int, Funding>> GetFundingsByEnrollmentIdsAsync(IEnumerable<int> enrollmentIds, DateTime? asOf = null);
		Task<Funding> GetFundingByIdAsync(int id, DateTime? asOf = null);
		Funding CreateFunding(
			int enrollmentId,
			FundingSource source,
			FundingTime time
		);
		Funding UpdateFunding(
			Funding funding,
			FundingSource? source,
			FundingTime? time
		);
	}
}
