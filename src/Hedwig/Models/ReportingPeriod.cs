using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Models.Attributes;

namespace Hedwig.Models
{
  [ReadOnly]
  public class ReportingPeriod : IHedwigIdEntity<int>
  {
    [Required]
    public int Id { get; set; }

    [Required]
    [JsonConverter(typeof(StringEnumConverter))]
    public FundingSource Type { get; set; }

    [Required]
    [Column(TypeName="date")]
    public DateTime Period { get; set; }
    [Required]
    [Column(TypeName="date")]
    public DateTime PeriodStart { get; set; }
    [Required]
    [Column(TypeName="date")]
    public DateTime PeriodEnd { get; set; }

    [Required]
    [Column(TypeName="date")]
    public DateTime DueAt { get; set; }
  }
}
