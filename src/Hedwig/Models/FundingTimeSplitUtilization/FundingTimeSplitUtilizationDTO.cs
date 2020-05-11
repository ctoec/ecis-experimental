namespace Hedwig.Models
{
	public class FundingTimeSplitUtilizationDTO
	{
		public int Id { get; set; }
		public int ReportingPeriodId { get; set; }
		public ReportingPeriod ReportingPeriod { get; set; }
		public int ReportId { get; set; }
		public int FundingSpaceId { get; set; }
		public int FullTimeWeeksUsed { get; set; }
		public int PartTimeWeeksUsed { get; set; }
	}
}
