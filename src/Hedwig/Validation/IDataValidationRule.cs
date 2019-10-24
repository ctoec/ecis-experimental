using System.Collections.Generic;

namespace Hedwig.Validations
{
  public interface IDataValidationRule<T>
  {
    IEnumerable<DataValidationIssue> Validate(T obj);
  }

  public interface IDataValidationBlockingRule<T> : IDataValidationRule<T> { }
}
