using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Hedwig.Models
{
  public abstract class Report
  {
    public int Id { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public FundingSource Type { get; private set; }

    public int ReportingPeriodId { get; set; }
    public ReportingPeriod ReportingPeriod { get; set; }

    public DateTime? SubmittedAt { get; set; }
  }
}
