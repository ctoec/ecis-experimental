using Microsoft.EntityFrameworkCore;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class FundingRepository : HedwigRepository, IFundingRepository
	{

		public FundingRepository(HedwigContext context) : base(context) {}

		public Funding GetFirstFundingByEnrollmentId(int id)
		{
			return _context.Fundings
				.Where(funding => funding.EnrollmentId == id)
				.Where(funding => funding.Source == FundingSource.CDC)
				.Include(funding => funding.FirstReportingPeriod)
				.OrderBy(funding => funding.FirstReportingPeriod.PeriodStart)
				.FirstOrDefault();
		}
	}

	public interface IFundingRepository : IHedwigRepository
	{
		Funding GetFirstFundingByEnrollmentId(int id);
	}
}
