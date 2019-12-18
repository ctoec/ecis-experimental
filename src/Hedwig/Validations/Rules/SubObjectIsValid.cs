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
  }
}