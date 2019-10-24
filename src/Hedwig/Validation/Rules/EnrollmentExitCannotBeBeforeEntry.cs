using System.Collections.Generic;
using Hedwig.Models;

namespace Hedwig.Validations
{
  class EnrollmentExitCannotBeBeforeEntry : IDataValidationBlockingRule<Enrollment>
  {
    private const string _message = "Cannot be before the start date.";

    public IEnumerable<DataValidationIssue> Validate(Enrollment enrollment)
    {
      if (enrollment.Exit < enrollment.Entry)
      {
        return new DataValidationIssue[] { new DataValidationIssue(_message, nameof(enrollment.Exit)) };
      }
      return new DataValidationIssue[0];
    }
  }
}
