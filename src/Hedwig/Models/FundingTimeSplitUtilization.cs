using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class FundingTimeSplitUtilization
	{
		[Required]
		public int Id { get; set; }
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
