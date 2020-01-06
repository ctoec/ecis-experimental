using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.ComponentModel.DataAnnotations.Schema;
using Hedwig.Validations;
using Hedwig.Validations.Attributes;
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

    [JsonConverter(typeof(StringEnumConverter))]
    public FundingSource Source { get; set; }

    // C4K funding fields
    [RequiredForFundingSource(FundingSource.C4K)]
    public int? FamilyId { get; set; }
    [RequiredForFundingSource(FundingSource.C4K)]
    public DateTime? CertificateStartDate { get; set; }
    public DateTime? CertificateEndDate { get; set; }

    // CDC funding fields
    public int? FirstReportingPeriodId {get; set; }
    public ReportingPeriod FirstReportingPeriod { get; set; }
    public int? LastReportingPeriodId { get; set; }
    [LastReportingPeriodAfterFirst]
    public ReportingPeriod LastReportingPeriod { get; set; }
    [RequiredForFundingSource(FundingSource.CDC)]
    [JsonConverter(typeof(StringEnumConverter))]
    public FundingTime? Time { get; set; }

    [NotMapped]
    public List<ValidationError> ValidationErrors { get; set; }
  }
}
