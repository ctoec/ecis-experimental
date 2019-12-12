namespace Hedwig.Validations.Rules
{
  public abstract class SubObjectIsValid
  {
    readonly IValidator _validator; 
    public SubObjectIsValid(IValidator validator)
    {
      _validator = validator;
    }

    protected void ValidateSubObject<T>(T subObject) where T : IValidateable
    {
      _validator.Validate(subObject);
    }
  }
}