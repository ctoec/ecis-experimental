using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Hedwig.Models
{
  public class Funding : TemporalEntity, INonBlockingValidatableObject
  {
    [Required]
    public int Id { get; set; }

    [Required]
    public int EnrollmentId { get; set; }
    public Enrollment Enrollment { get; set; }

    public DateTime Entry { get; set; }
    public DateTime? Exit { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public FundingSource Source { get; set; }

    [JsonConverter(typeof(StringEnumConverter))]
    public FundingTime Time { get; set; }

    [NotMapped]
    public List<ValidationError> ValidationErrors { get; set; }
  }
}
