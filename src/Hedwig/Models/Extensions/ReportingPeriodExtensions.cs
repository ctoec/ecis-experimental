using System;

namespace Hedwig.Models.Extensions
{
	public static class ReportingPeriodExtensions
	{
		public static int NumberOfWeeks(this ReportingPeriod reportingPeriod)
		{
			var reportingPeriodEnd = reportingPeriod.PeriodEnd;
			var modifiedReportingPeriodEnd = reportingPeriodEnd.AddDays(1);
			var reportingPeriodStart = reportingPeriod.PeriodStart;
			var difference = reportingPeriodEnd.Subtract(reportingPeriodStart);
			var differenceInDays = difference.TotalDays;
			var differenceInWeeks = differenceInDays / 7;
			return (int)Math.Ceiling(differenceInWeeks);
		}
	}
}
