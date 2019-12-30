using System.Collections.Generic;

namespace Hedwig.Validations.Rules
{
  public abstract class SubObjectIsValid
  {
    readonly INonBlockingValidator _validator; 
    public SubObjectIsValid(INonBlockingValidator validator)
    {
      _validator = validator;
    }

    protected void ValidateSubObject<T>(T subObject) where T : INonBlockingValidatableObject
    {
      _validator.Validate(subObject);
    }

    protected void ValidateSubObject<T>(List<T> subObjects) where T : INonBlockingValidatableObject
    {
      subObjects.ForEach(subObject => ValidateSubObject(subObject));
    }
  }
}