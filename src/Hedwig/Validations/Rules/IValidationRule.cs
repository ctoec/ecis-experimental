namespace Hedwig.Validations.Rules
{
  public interface IValidationRule<T> 
    where T : IValidateable
  { 
    ValidationError Execute(T entity);
  }
}