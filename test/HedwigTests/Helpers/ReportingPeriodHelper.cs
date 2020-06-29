using System;
using System.Linq;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class ReportingPeriodHelper
	{

		public static ReportingPeriod GetOrCreateReportingPeriodForPeriod(
			HedwigContext context,
			string period,
			string periodStart,
			string periodEnd,
			string dueAt = null,
			FundingSource type = FundingSource.CDC
	)
		{
			var existing = context.ReportingPeriods
				.Where(reportingPeriod => reportingPeriod.Type == type)
				.Where(reportingPeriod => reportingPeriod.Period == DateTime.Parse(period))
				.FirstOrDefault();

			if (existing != null)
			{
				return existing;
			}

			dueAt = dueAt == null ? DateTime.Parse(periodEnd).AddDays(15).ToShortDateString() : dueAt;
			return CreateReportingPeriod(context, type, period, periodStart, periodEnd, dueAt);
		}
		public static ReportingPeriod CreateReportingPeriod(
			HedwigContext context,
			FundingSource type = FundingSource.CDC,
			string period = "2019-10-01",
			string periodStart = "2019-10-01",
			string periodEnd = "2019-10-01",
			string dueAt = "2019-10-01"
		)
		{
			var reportingPeriod = new ReportingPeriod
			{
				Type = type,
				Period = DateTime.Parse(period),
				PeriodStart = DateTime.Parse(periodStart),
				PeriodEnd = DateTime.Parse(periodEnd),
				DueAt = DateTime.Parse(dueAt)
			};

			context.Add(reportingPeriod);
			context.SaveChanges();
			return reportingPeriod;
		}
	}
}
