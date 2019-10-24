using System.Collections.Generic;
using Hedwig.Models;

namespace Hedwig.Validations
{
  class EnrollmentEntryCannotBeBeforeBirthdate : IDataValidationBlockingRule<Enrollment>
  {
    private const string _message = "Cannot be before the child's birthdate.";

    public IEnumerable<DataValidationIssue> Validate(Enrollment obj)
    {
      if (obj.Entry < obj.Child.Birthdate)
      {
        return new DataValidationIssue[] { new DataValidationIssue(_message, nameof(obj.Entry)) };
      }
      return new DataValidationIssue[0];
    }
  }
}
