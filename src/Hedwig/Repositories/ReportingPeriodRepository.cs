using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class ReportingPeriodRepository : HedwigRepository, IReportingPeriodRepository
	{
		public ReportingPeriodRepository(HedwigContext context) : base(context) { }

		public async Task<List<ReportingPeriod>> GetReportingPeriodsByFundingSourceAsync(FundingSource source)
		{
			return await _context.ReportingPeriods
				.Where(period => period.Type == source)
				.ToListAsync();
		}
	}

	public interface IReportingPeriodRepository : IHedwigRepository
	{
		Task<List<ReportingPeriod>> GetReportingPeriodsByFundingSourceAsync(FundingSource source);
	}
}
