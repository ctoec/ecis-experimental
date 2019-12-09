using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hedwig.Models
{
  public class ReportingPeriod
  {
    public int Id { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public FundingSource Type { get; set; }

    public DateTime Period { get; set; }
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }

    public DateTime DueAt { get; set; }
  }
}
