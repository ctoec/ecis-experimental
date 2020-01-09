using Hedwig.Models;
using Hedwig.Repositories;
using System.Collections.Generic;
using System;

namespace Hedwig.Validations.Rules
{
  public class ChildIsValid: SubObjectIsValid, IValidationRule<Enrollment>
  {
    readonly IChildRepository _children;
    public ChildIsValid(
      INonBlockingValidator validator,
      IChildRepository children
    ) : base(validator)
    {
      _children = children;
    }

    public ValidationError Execute(Enrollment enrollment)
    {
      if(enrollment.ChildId != Guid.Empty)
      {
        var child = enrollment.Child ?? _children.GetChildById(enrollment.ChildId);
        child.Enrollments = new List<Enrollment>{enrollment};

        ValidateSubObject(child);
        if(child.ValidationErrors.Count > 0)
        {
          return new ValidationError(
            field: "Child",
            message: "Child has validation errors",
            isSubObjectValidation: true
          );
        }
      }

      return null;
    }
  }
}