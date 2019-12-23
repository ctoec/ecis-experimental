using Hedwig.Models;
using Hedwig.Repositories;

namespace Hedwig.Validations.Rules
{
  public class FamilyIsValid : SubObjectIsValid, IValidationRule<Child>
  {
    readonly IFamilyRepository _families;

    public FamilyIsValid(
      INonBlockingValidator validator,
      IFamilyRepository families
    ) : base (validator)
    {
      _families = families;
    }

    public ValidationError Execute(Child child)
    {
      if(child.FamilyId.HasValue)
      {
        if(child.Family == null)
        {
          _families.GetFamilyById(child.FamilyId.Value);
        }

        ValidateSubObject(child.Family);
        if(child.Family.ValidationErrors.Count > 0)
        {
          return new ValidationError(
            field: "Family",
            message: "Family has validation errors"
          );
        }
      }

      return null;
    }
  }
}