using System;
using Hedwig.Data;
using Hedwig.Models;

namespace HedwigTests.Helpers
{
	public class ReportingPeriodHelper
	{
		public static ReportingPeriod CreatePeriod(
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

			context.ReportingPeriods.Add(reportingPeriod);
			context.SaveChanges();
			return reportingPeriod;
		}
	}
}
