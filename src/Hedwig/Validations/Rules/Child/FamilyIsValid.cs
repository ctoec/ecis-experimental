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
        var family = child.Family ?? _families.GetFamilyById(child.FamilyId.Value);

        ValidateSubObject(family);
        if(family.ValidationErrors.Count > 0)
        {
          return new ValidationError(
            field: "Family",
            message: "Family has validation errors",
            isSubObjectValidation: true
          );
        }
      }

      return null;
    }
  }
}