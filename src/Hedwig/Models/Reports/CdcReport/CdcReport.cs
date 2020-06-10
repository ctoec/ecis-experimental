using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;
using Hedwig.Validations.Attributes;

namespace Hedwig.Models
{
	public class CdcReport : OrganizationReport
	{
		[Required]
		public bool Accredited { get; set; } = false;

		[Column(TypeName = "decimal(18,2)")]
		[Required]
		public decimal? C4KRevenue { get; set; }
		public bool RetroactiveC4KRevenue { get; set; } = false;

		[Column(TypeName = "decimal(18,2)")]
		[Required]
		public decimal? FamilyFeesRevenue { get; set; }

		public string Comment { get; set; }

		[FundingTimeUtilizationsWeeksUsedDoNotExceedTotalAvailableWeeks]
		[FundingTimeUtilizationsWeeksUsedAreLessThanReportingPeriodWeeks]
		public ICollection<FundingTimeSplitUtilization> TimeSplitUtilizations { get; set; }
	}
}
