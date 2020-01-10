using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Rules
{
  public class FundingsAreValid: SubObjectIsValid, IValidationRule<Enrollment>
  {
    readonly IFundingRepository _fundings;
    public FundingsAreValid(
      INonBlockingValidator validator,
      IFundingRepository fundings
    ) : base(validator)
    {
      _fundings = fundings;
    }

    public ValidationError Execute(Enrollment enrollment)
    {
      if (enrollment == null)
      {
        return null;
      }

      var fundings = enrollment.Fundings ?? _fundings.GetFundingsByEnrollmentId(enrollment.Id);
      foreach(var funding in fundings)
      {
        // Hydrate fundings with enrollment object so it can be accessed in funding validations
        funding.Enrollment = enrollment;

        ValidateSubObject(funding);
        if(funding.ValidationErrors.Count > 0)
        {
          return new ValidationError(
            field: "Fundings",
            message: "Fundings has validation errors",
            isSubObjectValidation: true
          );
        }
      }

      return null;
    }
  }
}