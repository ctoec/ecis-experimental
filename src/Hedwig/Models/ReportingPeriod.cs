using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
  public class ReportingPeriod : IHedwigIdEntity<int>
  {
    [Required]
    public int Id { get; set; }

    [Required]
    [JsonConverter(typeof(StringEnumConverter))]
    public FundingSource Type { get; set; }

    [Required]
    public DateTime Period { get; set; }
    [Required]
    public DateTime PeriodStart { get; set; }
    [Required]
    public DateTime PeriodEnd { get; set; }

    [Required]
    public DateTime DueAt { get; set; }
  }
}
