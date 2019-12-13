using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;

namespace Hedwig.Models
{
  public abstract class Report : IValidateable
  {
    public int Id { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public FundingSource Type { get; private set; }

    public int ReportingPeriodId { get; set; }
    public ReportingPeriod ReportingPeriod { get; set; }

    public DateTime? SubmittedAt { get; set; }

    [NotMapped]
    public List<ValidationError> ValidationErrors { get; set; }
  }
}
