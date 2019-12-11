using Hedwig.Models;
using Hedwig.Repositories;
using System.Linq;

namespace Hedwig.Validations.Rules
{
  public class DeterminationIsValid: SubObjectIsValid, IValidationRule<Family>
  {
    //TODO: can we get around having to define private base class constructor param?
    public DeterminationIsValid(
      IValidator validator,
      IFamilyDeterminationRepository determinations
    ) : base(validator)
    {
      _determinations = determinations;
    }

    readonly IFamilyDeterminationRepository _determinations;
    public ValidationError Execute(Family family)
    {
      if(family.Determinations == null)
      {
        // TODO: make Execute return Task<ValidationError> everywhere to allow for this
        //await _determinations.GetDeterminationsByFamilyIdAsync(family.Id);
      }

      if(family.Determinations.Count == 0) return null;

      var determination = family.Determinations.First();
      ValidateSubObject(determination);

      if(determination.ValidationErrors.Count > 0)
      {
        return new ValidationError(
          field: determination.GetType().Name,
          message: "Determination has validation errors"
        );
      }

      //TODO somehow unload determinations if we added them

      return null;
    }
  }
}