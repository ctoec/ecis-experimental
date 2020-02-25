using Microsoft.EntityFrameworkCore;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;
using System.Collections.Generic;

namespace Hedwig.Repositories
{
	public class FundingRepository : HedwigRepository, IFundingRepository
	{

		public FundingRepository(HedwigContext context) : base(context) { }

		public List<Funding> GetFundingsByEnrollmentId(int enrollmentId)
		{
			return _context.Fundings
				.Where(f => f.EnrollmentId == enrollmentId)
				.Include(f => f.FirstReportingPeriod)
				.Include(f => f.LastReportingPeriod)
				.ToList();
		}
	}

	public interface IFundingRepository : IHedwigRepository
	{
		List<Funding> GetFundingsByEnrollmentId(int enrollmentId);
	}
}
