using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class FundingTimeSplitUtilization
	{
		[Required]
		public int Id { get; set; }
		// Duplicative information (on the report) to make client-side logic easier
		[Required]
		public int ReportingPeriodId { get; set; }
		public ReportingPeriod ReportingPeriod { get; protected set; }

		[Required]
		public int ReportId { get; set; }
		public CdcReport Report { get; set; }
		[Required]
		public int FundingSpaceId { get; set; }
		public FundingSpace FundingSpace { get; set; }

		[Required]
		public int FullTimeWeeksUsed { get; set; }
		[Required]
		public int PartTimeWeeksUsed { get; set; }
	}
}
