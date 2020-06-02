using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Hedwig.Models
{
	public class FundingSpace : IHedwigIdEntity<int>
	{
		[Required]
		public int Id { get; set; }

		[Required]
		public int Capacity { get; set; }

		[Required]
		public int OrganizationId { get; set; }
		public Organization Organization { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		[Required]
		public FundingSource Source { get; set; }

		[JsonConverter(typeof(StringEnumConverter))]
		[Required]
		public Age AgeGroup { get; set; }
		public List<Funding> Fundings { get; set; }

		[Required]
		public FundingTime Time { get; set; }
		public FundingTimeSplit TimeSplit { get; set; }
		public ICollection<FundingTimeSplitUtilization> TimeSplitUtilizations { get; protected set; }
	}
}
