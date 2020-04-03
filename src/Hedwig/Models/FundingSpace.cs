using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

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
		public List<Funding> Fundings { get; set; }
		public List<FundingTimeAllocation> FundingTimeAllocations { get; set; }
	}

	public class FundingTimeAllocation
	{
		[Required]
		[JsonConverter(typeof(StringEnumConverter))]
		public FundingTime Time { get; set; }
		
		[Required]
		public int Weeks { get; set; }
	}

	public static class FundingConverterExtensions
	{
		public static List<FundingTimeAllocation> DeserializeFundingTimeAllocations(this string dbValue)
		{
			return JsonConvert.DeserializeObject<List<FundingTimeAllocation>>(dbValue);
		}

		public static string SerializeFundingTimeAllocations(this List<FundingTimeAllocation> appModelValue)
		{
			return JsonConvert.SerializeObject(appModelValue);
		}
	}
}
