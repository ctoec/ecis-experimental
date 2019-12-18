using Hedwig.Validations;

namespace Hedwig.Validations.Rules
{
  public class Required<T>: IValidationRule<T> where T : INonBlockingValidatableObject
  {
    readonly string _field;
    public Required(string field)
    {
      _field = field;
    }

    public ValidationError Execute(T entity)
    {
      var prop = typeof(T).GetProperty(_field);
      if(prop != null)
      {
        var value = prop.GetValue(entity);
        if (value == null)
        {
          return new ValidationError(
            field: _field,
            message: $"{_field} is required"
          );
        }
      }

      return null;
    }
  }
}