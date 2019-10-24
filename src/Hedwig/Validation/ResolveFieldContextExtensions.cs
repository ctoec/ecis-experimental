using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Hedwig.Validations
{
  public static class ResolveFieldContextExtensions
  {
    public static bool AddDataValidationErrors<T>(this ResolveFieldContext<T> context, IDataValidator<T> validator, T obj, IEnumerable<string> props = null)
    {
      props = props ?? context.Arguments.Keys.Select(key => Char.ToUpperInvariant(key[0]) + key.Substring(1));
      var errors = validator.BlockingErrorsForProperties(obj, props);
      context.Errors.AddRange(errors);
      return errors.Any();
    }
  }
}
