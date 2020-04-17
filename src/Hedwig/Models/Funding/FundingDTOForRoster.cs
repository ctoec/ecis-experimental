using Hedwig.Validations;
using System.Collections.Generic;

namespace Hedwig.Models
{
	public class FundingDTOForRoster
	{
		public int Id { get; set; }
		public int EnrollmentId { get; set; }
		public FundingSpaceDTOForRoster FundingSpace { get; set; }
		public int? FundingSpaceId { get; set; }
		public FundingSource? Source { get; set; }
		public int? FirstReportingPeriodId { get; set; }
		public ReportingPeriod FirstReportingPeriod { get; set; }
		public int? LastReportingPeriodId { get; set; }
		public ReportingPeriod LastReportingPeriod { get; set; }
		public List<ValidationError> ValidationErrors { get; set; }
	}
}
