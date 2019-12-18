using System.Linq;
using System;

namespace Hedwig.Validations.Rules
{
  public abstract class OneOfFieldsRequired<T> : IValidationRule<T> where T : INonBlockingValidatableObject
  {
    readonly string[] _fields;

    public OneOfFieldsRequired(string[] fields)
    {
      _fields = fields;
    }

    public ValidationError Execute(T entity)
    {
      var oneOfFieldsIsSet = false;

      var props = typeof(T).GetProperties();
      foreach (var prop in props)
      {
        if(_fields.Contains(prop.Name))
        {
          var value = prop.GetValue(entity);
          if(value != null) oneOfFieldsIsSet = true;
        }
      }

      if(!oneOfFieldsIsSet)
      {
        var fieldsString = String.Join(",", _fields);
        return new ValidationError
        (
          field: $"{fieldsString}",
          message: $"One of [{fieldsString}] is required"
        );
      }

      return null;
    }
  }
}