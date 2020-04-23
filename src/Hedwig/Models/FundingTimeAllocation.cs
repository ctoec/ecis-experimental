using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models

{
	public class FundingTimeAllocation
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public int FundingSpaceId { get; set; }
		public FundingSpace FundingSpace { get; set; }

		[Required]
		public int Weeks { get; set; }

		[Required]
		[JsonConverter(typeof(StringEnumConverter))]
		public FundingTime Time { get; set; }
	}
}
