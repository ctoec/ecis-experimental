using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using GraphQL;

namespace Hedwig.Validations
{
  public class DataValidator<T> : IDataValidator<T>
  {
    private IEnumerable<IDataValidationRule<T>> _rules;
    private ConcurrentDictionary<T, IEnumerable<DataValidationIssue>> _nonBlockingResults = new ConcurrentDictionary<T, IEnumerable<DataValidationIssue>>();
    private ConcurrentDictionary<T, IEnumerable<DataValidationIssue>> _blockingResults = new ConcurrentDictionary<T, IEnumerable<DataValidationIssue>>();

    public DataValidator(IEnumerable<IDataValidationRule<T>> rules) => _rules = rules;

    public IEnumerable<DataValidationIssue> Validate(T obj)
    {
      return FetchBlockingResults(obj).Concat(FetchNonBlockingResults(obj));
    }

    public IEnumerable<ExecutionError> BlockingErrorsForProperties(T obj, IEnumerable<string> props)
    {
      return FetchBlockingResults(obj)
        .Where(result => props.Contains(result.property))
        .Select(result => new ExecutionError(message: $"{nameof(T)};{result.property};{result.message}"));
    }

    private IEnumerable<DataValidationIssue> FetchNonBlockingResults(T obj)
    {
      return _nonBlockingResults.GetOrAdd(obj,
        o => _rules.Where(rule => !(rule is IDataValidationBlockingRule<T>)).SelectMany(rule => rule.Validate(o))
      );
    }

    private IEnumerable<DataValidationIssue> FetchBlockingResults(T obj)
    {
      return _blockingResults.GetOrAdd(obj,
        o => _rules.OfType<IDataValidationBlockingRule<T>>().SelectMany(rule => rule.Validate(o))
      );
    }
  }

  public interface IDataValidator<T>
  {
    IEnumerable<DataValidationIssue> Validate(T obj);
    IEnumerable<ExecutionError> BlockingErrorsForProperties(T obj, IEnumerable<string> props);
  }
}
