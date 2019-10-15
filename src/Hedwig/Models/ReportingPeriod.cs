using System;

namespace Hedwig.Models
{
	public class ReportingPeriod
	{
		public int Id { get; set; }

		public FundingSource Type { get; set; }

		public DateTime Period { get; set; }
		public DateTime PeriodStart { get; set; }
		public DateTime PeriodEnd { get; set; }

		public DateTime DueAt { get; set; }
	}
}
