namespace Hedwig.Validations.Rules
{
  public abstract class ConditionalFieldRequired<T> : IValidationRule<T> where T : INonBlockingValidatableObject
  {
    readonly string _conditionalMessage;
    readonly string _field;

    public ConditionalFieldRequired(string field)
    {
      _field = field;
    }

    protected abstract bool CheckCondition(T entity);
    public ValidationError Execute(T entity)
    {
      var prop = typeof(T).GetProperty(_field);
      if(prop != null)
      {
        var value = prop.GetValue(entity);
        if(CheckCondition(entity) && value == null)
        {
          return new ValidationError(
            field: _field,
            message: $"{_field} is required when ${_conditionalMessage}"
          );
        }
      }

      return null;
    }
  }
}