using System;
using System.Collections.Generic;
using System.Linq;
using Hedwig.Models;
using Hedwig.Data;

namespace Hedwig.Repositories
{
	public class ReportingPeriodRepository : HedwigRepository, IReportingPeriodRepository
	{
		public ReportingPeriodRepository(HedwigContext context) : base(context) { }

		public List<ReportingPeriod> GetReportingPeriodsByFundingSource(FundingSource source)
		{
			return _context.ReportingPeriods
				.Where(period => period.Type == source)
				.ToList();
		}

		public ReportingPeriod GetLastReportingPeriodBeforeDate(FundingSource source, DateTime compareDate)
		{
			return _context.ReportingPeriods
				.Where(period => period.Type == source)
				.Where(period => period.PeriodEnd.Date <= compareDate)
				.OrderByDescending(period => period.Period)
				.FirstOrDefault();
		}

		public ReportingPeriod GetById(int id)
		{
			return _context.ReportingPeriods
				.FirstOrDefault(period => period.Id == id);
		}
	}

	public interface IReportingPeriodRepository : IHedwigRepository
	{
		List<ReportingPeriod> GetReportingPeriodsByFundingSource(FundingSource source);
		ReportingPeriod GetLastReportingPeriodBeforeDate(FundingSource source, DateTime compareDate);

		ReportingPeriod GetById(int id);
	}
}
