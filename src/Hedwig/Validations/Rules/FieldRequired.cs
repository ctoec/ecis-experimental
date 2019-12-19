namespace Hedwig.Validations.Rules
{
  public abstract class FieldRequired<T>: IValidationRule<T> where T : INonBlockingValidatableObject
  {
    readonly string _fieldName;
    readonly string _prettyFieldName;
    public FieldRequired(string fieldName, string prettyFieldName = null)
    {
      _fieldName = fieldName;
      _prettyFieldName = prettyFieldName;
    }
    public ValidationError Execute(T entity)
    {
      var prop = typeof(T).GetProperty(_fieldName);
      if(prop != null)
      {
        var value = prop.GetValue(entity);
        if (value == null)
        {
          return new ValidationError(
            field: _fieldName,
            message: $"{(_prettyFieldName != null ? _prettyFieldName : _fieldName)} is required"
          );
        }
      }

      return null;
    }
  }
}