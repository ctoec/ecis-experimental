namespace Hedwig.Validations.Rules
{
  public abstract class FieldRequired<T>: IValidationRule<T> where T : INonBlockingValidatableObject
  {
    readonly string _fieldName;
    readonly string _prettyFieldName;
    readonly bool _isSubObjectValidation;
    public FieldRequired(
      string fieldName,
      string prettyFieldName = null,
      bool isSubObjectValidation = false
    )
    {
      _fieldName = fieldName;
      _prettyFieldName = prettyFieldName;
      _isSubObjectValidation = isSubObjectValidation;
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
            message: $"{(_prettyFieldName != null ? _prettyFieldName : _fieldName)} is required",
            isSubObjectValidation: _isSubObjectValidation,
            field: _fieldName
          );
        }
      }

      return null;
    }
  }
}