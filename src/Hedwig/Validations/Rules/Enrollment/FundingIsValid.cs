using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;
using System;

namespace Hedwig.Validations.Rules
{
  public class FundingIsValid: SubObjectIsValid, IValidationRule<Enrollment>
  {
    readonly IFundingRepository _fundings;
    public FundingIsValid(
      INonBlockingValidator validator,
      IFundingRepository fundings
    ) : base(validator)
    {
      _fundings = fundings;
    }

    public ValidationError Execute(Enrollment enrollment)
    {
      if (enrollment != null && enrollment.Fundings.Count > 0)
      {

        var funding = _fundings.GetFirstFundingByEnrollmentId(enrollment.Id);

        ValidateSubObject(funding);
        if(funding.ValidationErrors.Count > 0)
        {
          return new ValidationError(
            field: "Fundings",
            message: "Fundings has validation errors"
          );
        }
      }

      return null;
    }
  }
}