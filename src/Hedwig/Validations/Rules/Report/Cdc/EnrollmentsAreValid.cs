using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
  public class EnrollmentsAreValid : SubObjectIsValid, IValidationRule<CdcReport>
  {
    readonly IReportRepository _reports;

    public EnrollmentsAreValid(
      INonBlockingValidator validator,
      IReportRepository reports
    ) : base(validator) 
    {
      _reports = reports;
    }

    public ValidationError Execute(CdcReport report)
    {
      
        var enrollments = report.Enrollments ?? _reports.GetEnrollmentsForReport(report);
        ValidateSubObject(enrollments);
        if(enrollments.Any(e => e.ValidationErrors.Count > 0))
        {
          return new ValidationError(
            field: "Enrollments",
            message: "Enrollments have validation errors"
          );
        }

      return null;
    }
  }
}