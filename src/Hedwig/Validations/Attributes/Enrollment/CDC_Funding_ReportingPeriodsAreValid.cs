using System.ComponentModel.DataAnnotations;
using Hedwig.Models;
using System;
using System.Collections.Generic;

namespace Hedwig.Validations.Attributes
{
  public class CDC_Funding_ReportingPeriodsAreValid : ValidationAttribute
  {
    protected override ValidationResult IsValid(object value, ValidationContext validationContext)
    {
      var enrollment = validationContext.ObjectInstance as Enrollment;
      var fundings = value as ICollection<Funding> ?? new List<Funding>{};

      foreach (var funding in fundings)
      {
        if(funding.Source != FundingSource.CDC)
        {
          continue;
        }

        if(enrollment.Entry.HasValue && funding.FirstReportingPeriod != null 
          && funding.FirstReportingPeriod.PeriodStart.Date > enrollment.Entry.Value.Date)
        {
          return new ValidationResult("First reporting period for CDC funding must start after enrollment");
        }

        if(enrollment.Exit.HasValue)
        {
          if(funding.LastReportingPeriod == null)
          {
            return new ValidationResult("Fundings for ended enrollments must have last reporting periods");
          }

          if(funding.LastReportingPeriod.PeriodStart.Date > enrollment.Exit.Value.Date)
          {
            return new ValidationResult("Last reporting period for CDC funding must start before enrollment ends");
          }
        }
      }

      return null;
    }

    private bool ReportingPeriodIsValid(ReportingPeriod period, DateTime? compareDate)
    {
      if(compareDate.HasValue && period != null)
      {
        if(period.PeriodStart.Date  > compareDate.Value.Date
          || period.PeriodEnd.Date < compareDate.Value.Date)
        {
          return false;
        }
      }

      return true;
    }
  }
}