using System;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public abstract class Report
	{
		public int Id { get; set; }

		public FundingSource Type { get; private set; }

		public int ReportingPeriodId { get; set; }
		public ReportingPeriod ReportingPeriod { get; set; }

		public DateTime? SubmittedAt { get; set; }
	}
}
