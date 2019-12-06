using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hedwig.Models
{
  public class FundingSpace
  {
    public int Id { get; set; }

    public int Capacity { get; set; }

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
