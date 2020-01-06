using System.ComponentModel.DataAnnotations;
using Hedwig.Models;

namespace Hedwig.Validations.Attributes
{
  public class LastReportingPeriodAfterFirst : ValidationAttribute
  {
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
      var funding = validationContext.ObjectInstance as Funding;
      var lastReportingPeriod = value as ReportingPeriod;

      if(lastReportingPeriod != null)
      {
        if(funding.FirstReportingPeriod == null)
        {
          return new ValidationResult("Last reporting period cannot be added without first reporting period");
        }

        if(lastReportingPeriod.Period < funding.FirstReportingPeriod.Period) 
        {
          return new ValidationResult("Last reporting period cannot be before first reporting period");
        }
      }

      return null;
    }
  }
}