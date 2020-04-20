using System;
using System.Collections.Generic;
using Hedwig.Validations;

namespace Hedwig.Models
{
	public class CdcReportDTO
	{
		public int Id { get; set; }
		public FundingSource Type { get; set; }
		public ReportingPeriod ReportingPeriod { get; set; }
		public DateTime? SubmittedAt { get; set; }
		public CdcReportOrganizationDTO Organization { get; set; } 
		public List<CdcReportEnrollmentDTO> Enrollments { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
