using Hedwig.Models;

namespace Hedwig.Validations.Rules
{
  public class IfEnrollmentEntry_FirstReportingPeriodRequired : IValidationRule<Funding>
  {
    public ValidationError Execute(Funding funding)
    {
      if(funding.Source == FundingSource.CDC)
      {
        if(funding.Enrollment.Entry.HasValue && funding.FirstReportingPeriod == null)
        {
          return new ValidationError(
            field: "FirstReportingPeriod",
            message: "First reporting period is required for funding on enrollments with start dates"
          );
        }
      }

      return null;
    }
  }
}