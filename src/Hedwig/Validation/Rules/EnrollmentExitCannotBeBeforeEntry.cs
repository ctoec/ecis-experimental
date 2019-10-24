using System.Collections.Generic;
using Hedwig.Models;

namespace Hedwig.Validations
{
  class EnrollmentExitCannotBeBeforeEntry : IDataValidationBlockingRule<Enrollment>
  {
    private const string _message = "Cannot be before the start date.";

    public IEnumerable<DataValidationIssue> Validate(Enrollment obj)
    {
      if (obj.Exit < obj.Entry)
      {
        return new DataValidationIssue[] { new DataValidationIssue(_message, nameof(obj.Exit)) };
      }
      return new DataValidationIssue[0];
    }
  }
}
