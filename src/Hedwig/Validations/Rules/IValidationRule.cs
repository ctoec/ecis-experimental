namespace Hedwig.Validations.Rules
{
  public interface IValidationRule<T> 
    where T : INonBlockingValidatableObject
  { 
    ValidationError Execute(T entity);
  }
}