using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
  public class MostRecentDeterminationIsValid: SubObjectIsValid, IValidationRule<Family>
  {
    //TODO: can we get around having to define private base class constructor param?
    public MostRecentDeterminationIsValid(
      INonBlockingValidator validator,
      IFamilyDeterminationRepository determinations
    ) : base(validator)
    {
      _determinations = determinations;
    }

    readonly IFamilyDeterminationRepository _determinations;
    public ValidationError Execute(Family family)
    {
      var determinations = family.Determinations ??  _determinations.GetDeterminationsByFamilyId(family.Id);

      if(determinations.Count == 0) return null;

      var determination = determinations
        .OrderByDescending(d => d.DeterminationDate)
        .First();

      ValidateSubObject(determination);

      if(determination.ValidationErrors.Count > 0)
      {
        return new ValidationError(
          field: "Determinations",
          message: "Most recent determination has validation errors",
          isSubObjectValidation: true
        );
      }

      return null;
    }
  }
}