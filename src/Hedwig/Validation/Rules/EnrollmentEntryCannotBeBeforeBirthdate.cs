using System.Collections.Generic;
using Hedwig.Models;

namespace Hedwig.Validations
{
  class EnrollmentEntryCannotBeBeforeBirthdate : IDataValidationBlockingRule<Enrollment>
  {
    private const string _message = "Cannot be before the child's birthdate.";

    public IEnumerable<DataValidationIssue> Validate(Enrollment enrollment)
    {
      if (enrollment.Entry < enrollment.Child.Birthdate)
      {
        return new DataValidationIssue[] { new DataValidationIssue(_message, nameof(enrollment.Entry)) };
      }
      return new DataValidationIssue[0];
    }
  }
}
