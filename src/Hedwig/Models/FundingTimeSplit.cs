using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class FundingTimeSplit
	{
		[Required]
		public int Id { get; set; }
		[Required]
		public int FundingSpaceId { get; set; }
		public FundingSpace FundingSpace { get; protected set; }
		[Required]
		public int FullTimeWeeks { get; set; }
		[Required]
		public int PartTimeWeeks { get; set; }
	}
}
