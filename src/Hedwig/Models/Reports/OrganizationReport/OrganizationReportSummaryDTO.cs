using System;

namespace Hedwig.Models
{
	public class OrganizationReportSummaryDTO
	{
		public int Id { get; set; }
		public FundingSource Type { get; set; }
		public ReportingPeriod ReportingPeriod { get; set; }
		public DateTime? SubmittedAt { get; set; }
		public OrganizationReportSummaryOrganizationDTO Organization { get; set; }
	}
}
