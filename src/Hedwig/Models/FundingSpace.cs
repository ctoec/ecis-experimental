using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
	public class FundingSpace : IHedwigIdEntity<int>
	{
		public int Id { get; set; }

		[Required]
		public int Capacity { get; set; }

		[Required]
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public FundingSource Source { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public FundingTime Time { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		public Age AgeGroup { get; set; }
	}
}
