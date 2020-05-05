using System;
using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class CdcReportDTO : IHedwigIdEntity<int>
	{
		public int Id { get; set; }

		public bool Accredited { get; set; }
		public decimal C4KRevenue { get; set; }
		public bool RetroactiveC4KRevenue { get; set; }
		public decimal? FamilyFeesRevenue { get; set; }
		public string Comment { get; set; }
		public ReportingPeriod ReportingPeriod { get; set; }
		public DateTime? SubmittedAt { get; set; }
		public ICollection<FundingTimeSplitUtilization> TimeSplitUtilizations { get; set; }
		public CdcReportOrganizationDTO Organization { get; set; }
		public List<CdcReportEnrollmentDTO> Enrollments { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
